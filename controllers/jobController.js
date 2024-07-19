const { application } = require("express");
const AppError = require("../utils/appError");
const jobModel = require("./../models/jobModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAlljobs = catchAsync(async (req, res, next) => {
  const jobs = await jobModel.find();
  res.status(401).json({
    status: "success",
    jobs,
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newjob = await jobModel.create({
    Title: req.body.title,
    companyName: req.body.companyName,
    location: req.body.location,
    discription: req.body.discription,
    expireDate: req.body.expireDate,
    postedOn: Date.now(),
    url: req.body.url,
    isOncampus: true,
    postedBy: req.user._id,
  });
  res.status(201).json({
    status: "success",
    job: newjob,
  });
});

exports.applyJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const jobDetail = await jobModel.findById(jobId);
  if (!jobDetail) {
    return next(new AppError("This Job either Expired or do not exist"));
  }
  const candidateDetail = await jobModel.updateOne(
    { _id: jobId },
    { $push: { appliedBy: { candidate: req.user._id, status: "pending" } } }
  );
  const updatedJob = await jobModel.findById(jobId);
  res.status(201).json({
    status: "success",
    updatedJob,
  });
});

exports.selectStudents = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  let jobDetail = await jobModel.findById(jobId);
  // Checking if user is recruiter or not

  if (!req.user._id.equals(jobDetail.postedBy)) {
    return next(
      new AppError("You do not have permission to perform this action"),
      401
    );
  }
  const selectedCandidates = req.body.selectStudents;
  for (var candidateDetail of jobDetail.appliedBy) {
    const id = candidateDetail.candidate.toString();
    if (selectedCandidates.includes(id)) {
      candidateDetail.status = "selected";
    } else {
      candidateDetail.status = "Rejected";
    }
  }
  // updating job details
  const updatedJob = await jobModel.updateOne({ _id: jobId }, jobDetail);
  res.status(201).json({
    status: "success",
    jobDetail,
  });
});

exports.userApplication = catchAsync(async (req, res, next) => {
  const applications = await jobModel
    .find({
      "appliedBy.candidate": req.user._id,
    })
    .select("-appliedBy");
  res.status(200).json({
    status: "success",
    YourApplications: applications,
  });
});
