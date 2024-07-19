const express = require("express");
const authController = require("./../controllers/authController");
const jobController = require("./../controllers/jobController");

const jobRouter = express.Router();

jobRouter.get("/", authController.protect, jobController.getAlljobs);
jobRouter.post(
  "/create",
  authController.protect,
  authController.restrictTo("admin", "recruiter"),
  jobController.createJob
);
jobRouter.post("/:id/apply", authController.protect, jobController.applyJob);
jobRouter.post(
  "/:id/select",
  authController.protect,
  jobController.selectStudents
);

module.exports = jobRouter;
