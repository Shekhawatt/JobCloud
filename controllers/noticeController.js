const express = require("express");
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const noticeModel = require("./../models/noticeModel");
const authController = require("./../controllers/authController");

exports.getAllNotices = catchAsync(async (req, res, next) => {
  const notices = await noticeModel
    .find({ date: { $lte: Date.now() } })
    .sort({ Date: 1 });
  res.status(200).json({
    status: "success",
    notices,
  });
});

exports.createNotice = catchAsync(async (req, res, next) => {
  const notice = await noticeModel.create({
    title: req.body.title,
    date: Date.now(),
    discription: req.body.discription,
    docs: req.body.docs,
  });
  req.status(201).json({
    status: "success",
    notice,
  });
});
