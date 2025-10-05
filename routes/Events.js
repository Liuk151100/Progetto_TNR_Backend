import express from "express";
import { createEvent, deleteEvent, getAllEvents, getSingleEvent, modifyEvent } from "../controller/Events.js";
import { validateId } from "../middlewares/validateId.js";

const eventsRouter = express.Router();
eventsRouter.get("/",getAllEvents)
eventsRouter.get("/:id",validateId,getSingleEvent)
eventsRouter.post("/",createEvent)
eventsRouter.patch("/:id", validateId ,modifyEvent)
eventsRouter.delete("/:id",validateId,deleteEvent)

export default eventsRouter