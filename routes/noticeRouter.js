const express = require("express");
const authController = require("./../controllers/authController");
const noticeController = require("./../controllers/noticeController");

const noticeRouter = express.Router();

noticeRouter.get("/", authController.protect, noticeController.getAllNotices);
noticeRouter.post(
  "/create",
  authController.protect,
  authController.restrictTo("admin"),
  noticeController.createNotice
);

module.exports = noticeRouter;
