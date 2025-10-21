import express from "express";
import { createUser, deleteUser, getAll, getSingleUser, modifyUserAndAvatar, modifyUserAndDoc } from "../controller/Users.js";
import { validateId } from "../middlewares/validateId.js";
import { manageAvatar } from "../middlewares/manageImage.js";
import { uploadDocumenti } from "../middlewares/uploadCloudinary.js";


const usersRouter = express.Router();
usersRouter.get("/", getAll)
usersRouter.get("/:id", validateId, getSingleUser)
usersRouter.post("/", manageAvatar ,createUser)
usersRouter.patch("/avatar/:id",manageAvatar, validateId, modifyUserAndAvatar)
usersRouter.patch("/docPersonali/:id",uploadDocumenti.array("docPersonali"), validateId, modifyUserAndDoc)
usersRouter.delete("/:id", validateId, deleteUser)

export default usersRouter