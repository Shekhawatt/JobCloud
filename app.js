const express = require("express");
const userRouter = require("./routes/userRouter");
const jobRouter = require("./routes/jobRouter");
const noticeRouter = require("./routes/noticeRouter");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
const appError = require("./utils/appError");
const eventRouter = require("./routes/eventRouter");
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// //Routes
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/event", eventRouter);

app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
