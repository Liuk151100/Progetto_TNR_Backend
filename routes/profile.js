import express from "express";
import { authMW } from "../middlewares/authMW.js";
import { getMe } from "../controller/profile.js";


const profileRouter = express.Router();

profileRouter.get("/", authMW, getMe);


export default profileRouter;