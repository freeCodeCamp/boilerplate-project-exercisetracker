const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  }, // String is shorthand for {type: String}
  logs: {
    type: Array,
  },
});

const User = mongoose.model("User", userSchema);

exports.User = User;
