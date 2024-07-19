const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  discription: {
    type: String,
    required: true,
  },
  expireDate: {
    type: Date,
  },
  postedOn: {
    type: Date,
  },
  url: {
    type: String,
    required: true,
  },
  isOncampus: {
    type: Boolean,
    default: false,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  appliedBy: [
    {
      candidate: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "selected", "rejected"],
      },
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
