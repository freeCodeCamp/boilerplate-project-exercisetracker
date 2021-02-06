const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

// Configuration
mongoose.connect(
  "mongodb+srv://dariooliveirajr:1234@freecodecluster.njsf1.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: false }));

const personSchema = new Schema({
  username: { type: String, required: true }
});
const personModel = mongoose.model("personModel", personSchema);

const exerciseSchema = new Schema({
  userId: String,
  description: String,
  duration: Number,
  date: Date
});
const exerciseModel = mongoose.model("exerciseModel", exerciseSchema);

// Routes

app.get("/api/exercise/users", (req, res) => {
  personModel.find({}, (err, data) => {
    if (err) res.send("Error");
    const newData = data.map((el) => {
      const _id = el._id;
      const username = el.username;
      return { _id, username };
    });
    res.json(newData);
  });
});

app.get("/api/exercise/log", (req, res) => {
  const userId = req.query.userId;
  let from = null;
  let to = null;
  let limit = null;

  if (req.query.from) {
    from = req.query.from;
  }
  if (req.query.to) {
    to = req.query.to;
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  if (from == null || to == null) {
    exerciseModel
      .find({
        userId
      })
      .limit(limit)
      .exec((err, data) => {
        if (err) res.send(err);
        const count = data.length;
        const userId = data[0].userId;
        const log = data.map((el) => {
          const description = el.description;
          const duration = el.duration;
          const date = el.date;
          return { description, duration, date };
        });
        personModel.findById(userId, (err, dataPerson) => {
          if (err) res.send(err);
          const username = dataPerson.username;
          const result = { _id: userId, username, count, log };
          res.json(result);
        });
      });
  } else {
    exerciseModel
      .find({
        userId,
        date: {
          $gte: from,
          $lt: to
        }
      })
      .limit(limit)
      .exec((err, data) => {
        if (err) res.send(err);
        const count = data.length;
        const userId = data[0].userId;
        const log = data.map((el) => {
          const description = el.description;
          const duration = el.duration;
          const date = el.date;
          return { description, duration, date };
        });
        personModel.findById(userId, (err, dataPerson) => {
          if (err) res.send(err);
          const username = dataPerson.username;
          const result = { _id: userId, username, count, log };
          res.json(result);
        });
      });
  }
});

app.post("/api/exercise/new-user", (req, res) => {
  const username = req.body.username;
  personModel.create({ username }, (err, data) => {
    if (err) res.send(err);
    res.json(data);
  });
});

app.post("/api/exercise/add", (req, res) => {
  const userId = req.body.userId;
  const description = req.body.description;
  let duration = req.body.duration;
  let date = new Date();
  if (req.body.date) {
    date = new Date(req.body.date);
  }

  exerciseModel.create({ userId, description, duration, date }, (err, data) => {
    if (err) res.send(err);
    personModel.findById(userId, (err, dataPerson) => {
      if (err) res.send(err);
      const username = dataPerson.username;
      duration = parseInt(duration);
      date = date.toDateString();
      const result = { _id: userId, username, date, duration, description };
      res.json(result);
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
