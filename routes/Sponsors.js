import express from "express";

import { validateId } from "../middlewares/validateId.js";
import { createSponsor, deleteSponsor, getAll, getSingleSponsor, modifySponsor } from "../controller/Sponsors.js";
import { manageLogo } from "../middlewares/manageImage.js";

const sponsorsRouter = express.Router();
sponsorsRouter.get("/", getAll)
sponsorsRouter.get("/:id", validateId, getSingleSponsor)
sponsorsRouter.post("/", manageLogo ,createSponsor)
sponsorsRouter.patch("/:id", validateId, modifySponsor)
sponsorsRouter.delete("/:id", validateId, deleteSponsor)

export default sponsorsRouter