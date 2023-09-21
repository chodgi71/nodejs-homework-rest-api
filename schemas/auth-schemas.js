import Joi from "joi";

const subscriptionList = ["starter", "pro", "business"];

const signupSchema = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid(...subscriptionList),
});

const signinSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});
const updateSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

export default {
  signupSchema,
  signinSchema,
  updateSchema,
};
