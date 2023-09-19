import contactSchemas from "../../schemas/contact-schemas.js";
import authSchemas from "../../schemas/auth-schemas.js";
import { validateBody } from "../../decorators/index.js";

const contactAddValidate = validateBody(contactSchemas.contactAddSchema);
const contactUpdateValidate = validateBody(contactSchemas.contactUpdateSchema);
const favoriteUpdateValidate = validateBody(
  contactSchemas.favoriteUpdateSchema
);

const userSignupValidate = validateBody(authSchemas.signupSchema);
const userSigninValidate = validateBody(authSchemas.signinSchema);

export default {
  contactAddValidate,
  contactUpdateValidate,
  favoriteUpdateValidate,
  userSignupValidate,
  userSigninValidate,
};
