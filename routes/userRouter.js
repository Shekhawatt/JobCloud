const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const jobController = require("./../controllers/jobController");

const userRouter = express.Router();

// Routes
userRouter.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);
userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.get("/logout", authController.protect, authController.logOut);
userRouter.get(
  "/myApplications",
  authController.protect,
  jobController.userApplication
);
userRouter.post("/update", authController.protect, userController.update);
userRouter.get("/:id", authController.protect, userController.getUser);
userRouter.post(
  "/:id/connect",
  authController.protect,
  userController.connectUser
);
userRouter.post(
  "/:id/connect/:action",
  authController.protect,
  userController.requestHandler
);
userRouter.get(
  "/recommandations",
  authController.protect,
  userController.recommand
);

module.exports = userRouter;
