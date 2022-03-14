const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    date: {
      type: Number,
    },
  },
  { versionKey: false },
);

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    log: [exerciseSchema],
  },
  { versionKey: false },
);

const User = mongoose.model("User", userSchema);

exports.User = User;
