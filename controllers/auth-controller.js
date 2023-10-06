import fs from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import { nanoid } from "nanoid";

import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail } from "../helpers/index.js";

import User from "../models/User.js";

const { JWT_SECRET, BASE_APP_URL } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "Email already exist.");

  const verificationCode = nanoid();
  const verifyEmail = {
    to: email,
    subject: "Verify email.",
    html: `<a target="_blank" href="${BASE_APP_URL}/api/users/verify/${verificationCode}">Click to verify email.</a>`,
  };

  await sendEmail(verifyEmail);

  const avatarURL = gravatar.url(
    email,
    { protocol: "https", s: "250", d: "mm" },
    true
  );
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
    avatar: newUser.avatarURL,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email or password invalid.");

  if (!user.verify) throw HttpError(401, "Email not verify");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password invalid.");

  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "47h" });
  await User.findByIdAndUpdate(id, { token });

  res.json({ token });
};

const signout = async (req, res) => {
  const { _id: id } = req.user;

  const user = await User.findByIdAndUpdate(id, { token: "" });

  res.status(204).json("Logout success");
};

const current = async (req, res) => {
  const { _id: id } = req.user;

  const user = await User.findById(id);
  const { email, subscription } = user;

  res.json({ email, subscription });
};

const updateCurrent = async (req, res) => {
  const { email } = req.user;
  const { subscription } = req.body;

  await User.findOneAndUpdate({ email }, { subscription });

  res.json({ message: `user '${email}' is now '${subscription}'` });
};

const updateAvatar = async (req, res) => {
  const { email } = req.user;
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  const result = await User.findOneAndUpdate(
    { email },
    { avatarURL },
    { new: true }
  );
  res.json(result);
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });
  if (!user) throw HttpError(404);

  await User.findByIdAndUpdate(
    user._id,
    {
      verify: true,
      verificationCode: "",
    },
    { new: true }
  );

  res.json("Email verify success");
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(404, "Email not found.");
  if (user.verify) throw HttpError(400, "Email already verify.");

  const verifyEmail = {
    to: email,
    subject: "Verify email.",
    html: `<a target="_blank" href="${BASE_APP_URL}/api/users/verify/${user.verificationCode}">Click to verify email.</a>`,
  };

  await sendEmail(verifyEmail);

  res.json("Verify email resend.");
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
  updateCurrent: ctrlWrapper(updateCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
};
