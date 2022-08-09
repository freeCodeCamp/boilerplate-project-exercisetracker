let mongoose = require("mongoose");

class Database {
  constructor() {
    this.__connect();
  }
  __connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch(() => {
        console.log("Failed to connect to MongoDB");
      });
  }
}

module.exports = new Database();
