import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";

import User from "../models/User.js";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "Email already exist.");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res
    .status(201)
    .json({ email: newUser.email, subscription: newUser.subscription });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, "Email or password invalid.");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password invalid.");

  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "47h" });
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

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
  updateCurrent: ctrlWrapper(updateCurrent),
};
