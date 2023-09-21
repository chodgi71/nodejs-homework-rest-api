import express from "express";
import contactsController from "../../controllers/contact-controller.js";
import validates from "../../middleware/validation/contact-validation.js";
import authenticate from "../../middleware/authenticate.js";


const contactRouter = express.Router();

contactRouter.use(authenticate);

contactRouter.get("/", contactsController.getAll);

contactRouter.get("/:contactId", contactsController.getById);

contactRouter.post("/", validates.contactAddValidate, contactsController.add);

contactRouter.delete("/:contactId", contactsController.removeById);

contactRouter.put("/:contactId", validates.contactUpdateValidate, contactsController.updateById);

contactRouter.put("/:contactId/favorite", validates.favoriteUpdateValidate, contactsController.updateStatusContact);

export default contactRouter;
