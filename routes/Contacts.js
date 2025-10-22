import express from "express";
import { contactUs } from "../controller/Contacts.js";

const contactRouter = express.Router();

contactRouter.post("/contactUs", contactUs);

export default contactRouter;
