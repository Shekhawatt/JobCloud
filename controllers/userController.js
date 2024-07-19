const userModel = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

//GetAllUsers Route
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    status: "success",

    users,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "regNo", "role");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.connectUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const newuser = await userModel.updateOne(
    { _id: id },
    { $push: { connectionRequests: req.user._id } }
  );
  res.status(201).json({
    status: "success",
  });
});

exports.requestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (req.params.action == "accept") {
    await userModel.updateOne(
      { _id: id },
      { $push: { connections: req.user._id } }
    );
    await userModel.updateOne(
      { _id: req.user._id },
      { $push: { connections: id } }
    );
    await userModel.updateOne(
      { _id: req.user._id },
      { $pull: { connectionRequests: id } }
    );
  }
  res.status(201).json({
    status: "success",
  });
});

exports.recommand = catchAsync(async (req, res, next) => {
  const recommandations = [];
  const user = req.user;
  for (id in user.connections) {
    const connections = await userModel.findById(id).connections;
    recommandations.push(connections);
  }
  res.status(200).json({
    status: "success",
    recommandations,
  });
});
