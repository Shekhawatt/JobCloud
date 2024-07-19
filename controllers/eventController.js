const AppError = require("../utils/appError");
const eventModel = require("./../models/eventModel");
const userModel = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

const k = 2;
const m = 1;
function probabilityOfAWinning(Ra, Rb) {
  return 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
}

exports.createEvent = catchAsync(async (req, res, next) => {
  const event = await eventModel.create({
    title: req.body.Title,
    discription: req.body.Discription,
    createdBy: req.user._id,
    clubName: req.body.clubName,
    date: req.body.date,
  });
  res.status(201).json({ status: "Sucess", event });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await eventModel.find({ date: { $gt: Date.now() } });
  res.status(200).json({
    status: "success",
    events,
  });
});

exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await eventModel.findById(req.params.id);
  if (!event) {
    return next(new AppError("No such event Exists"), 401);
  }
  res.status(200).json({
    status: "success",
    event,
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(new AppError("No such event Exists"), 401);
  }
  const newEvent = await eventModel.updateOne(
    { _id: eventId },
    { $push: { registedBy: req.user._id } }
  );
  res.status(201).json({
    status: "success",
    event: newEvent,
  });
});

exports.result = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  const event = await eventModel.findById(eventId);
  if (!event) {
    return next(new AppError("No such event Exists"), 401);
  }
  const scoreCard = req.body.scorecard;
  // scorecard -> user._id , rank
  const ratingChanges = {};

  // updating ratingChanges
  const usersParticipated = Object.keys(scoreCard);

  Object.entries(scoreCard).forEach(async ([userId, rank], index) => {
    // Finding expected rank of User->

    let currentUser = await userModel.findById(userId);
    let currentRating = currentUser?.rating;
    let expectedRank = usersParticipated.length;
    for (let i = 0; i < usersParticipated.length; i++) {
      if (usersParticipated[i] === userId) continue;

      let userRating = await userModel.findById(usersParticipated[i])?.rating;

      expectedRank -= probabilityOfAWinning(currentRating, userRating);
    }

    let regularFactor = expectedRank - rank;
    let bonusFactor = usersParticipated.length / rank;

    // get Rating updation  = k * regular_factor[B] + m * bonus_factor[B].

    let ratingChange = regularFactor * k + m * bonusFactor;

    ratingChanges[userId] = ratingChange;
  });

  // updating Scorecard of a event
  const newEvent = await eventModel.updateOne(
    { _id: eventId },
    { scorecard: req.body.scorecard }
  );

  res.status(201).json({
    status: "success",
    event: newEvent,
  });
});
