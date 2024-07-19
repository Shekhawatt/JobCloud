const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  clubName: {
    type: String,
  },
  date: {
    type: Date,
  },
  registedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  scorecard: {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    rank: {
      type: Number,
    },
  },
});

const event = mongoose.model("event", eventSchema);
module.exports = event;
