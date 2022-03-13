const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
    }, // String is shorthand for {type: String}
    count: {
      type: Number,
    },
    log: {
      type: Array,
    },
  },
  { versionKey: false },
);

const User = mongoose.model("User", userSchema);

exports.User = User;
