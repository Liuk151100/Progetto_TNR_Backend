import express from "express";
import {deleteMe, edit, getMe } from "../controller/profile.js";
import { authMW } from "../middlewares/authMW.js";

const profileRouter = express.Router();

profileRouter.get("/", authMW, getMe);
profileRouter.put("/edit", authMW, edit);
profileRouter.delete("/", authMW, deleteMe);

export default profileRouter;
