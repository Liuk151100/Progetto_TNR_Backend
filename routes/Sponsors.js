import express from "express";

import { validateId } from "../middlewares/validateId.js";
import { manageAvatar } from "../middlewares/manageImage.js";
import { createSponsor, deleteSponsor, getAll, getSingleSponsor, modifySponsor } from "../controller/Sponsors.js";

const sponsorsRouter = express.Router();
sponsorsRouter.get("/", getAll)
sponsorsRouter.get("/:id", validateId, getSingleSponsor)
sponsorsRouter.post("/", manageAvatar ,createSponsor)
sponsorsRouter.patch("/:id", validateId, modifySponsor)
sponsorsRouter.delete("/:id", validateId, deleteSponsor)

export default sponsorsRouter