import express from "express";
import { createUser, deleteUser, getAll, getSingleUser } from "../controller/Users.js";

const usersRouter = express.Router();
usersRouter.get("/",getAll)
usersRouter.get("/:id",getSingleUser)
usersRouter.post("/",createUser)
usersRouter.delete("/:id",deleteUser)

export default usersRouter