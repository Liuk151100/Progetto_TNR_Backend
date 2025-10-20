import express from "express";
import { contactUs, safeGuarding } from "../controller/Contacts.js";

const contactRouter = express.Router();

contactRouter.post("/contactUs", contactUs);
contactRouter.post("/safeGuarding", safeGuarding);

export default contactRouter;
