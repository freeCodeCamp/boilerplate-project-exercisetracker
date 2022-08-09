var mongoose = require("mongoose");
var shortid = require("shortid");

let user = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  _id: {
    type: String,
    default: shortid.generate,
  },
});

module.exports = mongoose.model("User", user);
