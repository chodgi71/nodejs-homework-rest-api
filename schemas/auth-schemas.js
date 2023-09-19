import Joi from "joi";

const signupSchema = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
});

const signinSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export default {
  signupSchema,
  signinSchema,
};
