const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  regNo: {
    type: String,
    unique: true,
    validate: {
      validator: function (el) {
        return !isNaN(Number(this.regNo));
      },
      message: "Your RegNo is invalid !",
    },
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "recruiter"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  photo: {
    type: String,
    default: "./../public/img/defalt.jpg",
  },
  resume: {
    skills: [
      {
        type: String,
      },
    ],
    Achievements: [
      {
        type: String,
      },
    ],
    education: [
      {
        Name: String,
        GPA: Number,
        OrgName: String,
      },
    ],
    personalProject: [
      {
        Name: {
          type: String,
          required: true,
        },
        Discription: {
          type: String,
        },
        TechStack: [
          {
            type: String,
          },
        ],
      },
    ],
    Courses: [{ type: String }],
  },
  connections: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
  connectionRequests: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
  rating: {
    type: Number,
  },
});

// middleware for save operation to encrpt passward
userSchema.pre("save", async function (next) {
  // if password is not modified then no need to encrypt it
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.passwardCompare = async function (
  userPassword,
  inputPassward
) {
  return await bcrypt.compare(inputPassward, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
