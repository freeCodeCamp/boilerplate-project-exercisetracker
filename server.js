const express = require("express");
const date_fns = require("date-fns");

const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { User } = require("./model");

("use strict");

require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.DB_LINK);
}

main().catch((err) => {
  console.log("Problem while conecting to db");
  console.log({ err });
  process.exit();
});

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  const user = new User({
    username: username,
  });

  user
    .save()
    .then((result) => {
      const { username, _id } = result;
      res.json({ username, _id });
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api/users/:id/exercises", (req, res) => {
  const id = req.params.id;
  const { _id, description, duration, date } = req.body;

  User.findById(id)
    .then((user) => {
      if (isNaN(duration)) {
        console.log("Bad duration");
        throw new Error("Duration should be a number representing the minutes.");
      }

      if (!date_fns.isMatch(date, "yyyy-MM-dd")) {
        console.log("Bad date");
        throw new Error("Wrong date format. Date formaat is yyyy-MM-dd");
      }

      if (!date_fns.isValid(new Date(date))) {
        console.log("Bad date");
        throw new Error("Wrong date format. Date formaat is yyyy-MM-dd");
      }

      if (!description) {
        throw new Error("Description is empty.");
      }

      const exercise = {
        description: description,
        duration: parseInt(duration),
        date: new Date(date),
      };

      user.log.push(exercise);

      user.save();

      exercise._id = user._id;
      exercise.username = user.username;
      exercise.date = exercise.date.toDateString();

      res.json(exercise);
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
