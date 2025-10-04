import express from "express";
import { createUser, deleteUser, getAll, getSingleUser, modifyUser } from "../controller/Users.js";
import { validateId } from "../middlewares/validateId.js";

const usersRouter = express.Router();
usersRouter.get("/",getAll)
usersRouter.get("/:id",validateId,getSingleUser)
usersRouter.post("/",createUser)
usersRouter.patch("/:id", validateId ,modifyUser)
usersRouter.delete("/:id",validateId,deleteUser)

export default usersRouter