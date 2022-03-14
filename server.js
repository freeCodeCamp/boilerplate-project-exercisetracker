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

app.post("/api/users/:id/exercises", async (req, res) => {
  const id = req.params.id;
  const { _id, description, duration, date } = req.body;

  User.findById(id)
    .then((user) => {
      if (isNaN(duration)) {
        console.log("Bad duration");
        throw new Error("Duration should be a number representing the minutes.");
      }

      if (!checkDate(date)) {
        throw new Error("Wrong date format. Date formaat is yyyy-MM-dd");
      }

      if (!description) {
        throw new Error("Description is empty.");
      }

      const tmpDate = date_fns.parseISO(date);

      const exercise = {
        description: description,
        duration: parseInt(duration),
        date: tmpDate.getTime(),
      };

      user.log.push(exercise);
      user.count++;

      user
        .save()
        .then((updated) => {
          exercise._id = updated._id;
          exercise.username = updated.username;
          exercise.date = tmpDate.toDateString();
          res.json(exercise);
        })
        .catch((e) => {
          throw new Error(e.message);
        });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

app.get("/api/users/:id/logs", async (req, res) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;

  User.findById(id)
    .then((user) => {
      const logs = user.log
        .filter(
          function (e) {
            if (fromHelper(e.date, from) && toHelper(e.date, to) && limitHelper(this.count, limit)) {
              this.count++;
              return true;
            }
            return false;
          },
          { count: 0 },
        )
        .map(function (e) {
          return {
            description: e.description,
            duration: e.duration,
            date: new Date(e.date).toDateString(),
          };
        });

      const response = {
        username: user.username,
        count: logs.length,
        _id: user._id,
        log: logs,
      };

      res.json(response);
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
});

function checkDate(date) {
  if (!date) {
    return false;
  }

  if (!date_fns.isMatch(date, "yyyy-MM-dd")) {
    return false;
  }

  if (!date_fns.isValid(new Date(date))) {
    return false;
  }

  return true;
}

function fromHelper(date, from) {
  if (checkDate(from)) {
    const fromDate = date_fns.parseISO(from).getTime();
    // console.log({ date, fromDate });
    return date >= fromDate;
  }
  return true;
}

function toHelper(date, to) {
  if (checkDate(to)) {
    const toDate = date_fns.parseISO(to).getTime();
    // console.log({ date, toDate });
    return date < toDate;
  }
  return true;
}

function limitHelper(count, limit) {
  if (isNaN(limit)) {
    return true;
  }
  return count < limit;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
