var mongoose = require("mongoose");

let log = new mongoose.Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: String,
    },
  ],
});

module.exports = mongoose.model("Log", log);
