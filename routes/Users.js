import express from "express";
import { createUser, deleteUser, getAll, getSingleUser, modifyUser } from "../controller/Users.js";
import { validateId } from "../middlewares/validateId.js";
import { manageAvatar } from "../middlewares/manageImage.js";

const usersRouter = express.Router();
usersRouter.get("/", getAll)
usersRouter.get("/:id", validateId, getSingleUser)
usersRouter.post("/", manageAvatar ,createUser)
usersRouter.patch("/:id", validateId, modifyUser)
usersRouter.delete("/:id", validateId, deleteUser)

export default usersRouter