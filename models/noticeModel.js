const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  discription: {
    type: String,
  },
  docs: {
    type: String,
  },
});

const noticeModel = mongoose.model("Notice", noticeSchema);
module.exports = noticeModel;
