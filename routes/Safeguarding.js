import express from "express";
import multer from "multer"
import { createsegn } from "../controller/Safeguarding.js";

const safeguardingRouter = express.Router();
const upload = multer({ dest: "uploads/" });

safeguardingRouter.post("/",upload.array("allegati"), createsegn)

export default safeguardingRouter