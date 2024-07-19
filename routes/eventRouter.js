const express = require("express");
const authController = require("./../controllers/authController");
const eventController = require("./../controllers/eventController");

const eventRouter = new express.Router();

eventRouter.post(
  "/create",
  authController.protect,
  authController.restrictTo("head", "admin"),
  eventController.createEvent
);
eventRouter.get("/", authController.protect, eventController.getAllEvents);
eventRouter.get("/:id", authController.protect, eventController.getEvent);

eventRouter.post(
  "/:id/register",
  authController.protect,
  eventController.register
);
module.exports = eventRouter;
