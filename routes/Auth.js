import express from "express";
import { login, register, redirectToMe } from "../controllers/Auth.js";
import passport from "passport";
import { registerMw } from "../middlewares/registerMw.js";


const authRouter = express.Router();

authRouter.post("/register", registerMw, register);
authRouter.post("/login", login);

authRouter.get(
  "/login-google",
  passport.authenticate("google", { scope: ['profile', 'email', 'birthday'] })//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! provare anche user al posto di birthday
);

authRouter.get(
  "/google-callback",
  passport.authenticate("google", { session: false }), //false perché non stiamo usando i coockies
  redirectToMe
);

export default authRouter;
