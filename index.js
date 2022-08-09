const express = require("express");
const app = express();
const cors = require("cors");

// Models
const ET = require("./models/exercise");
require("dotenv").config();
const bodyParser = require("body-parser");
const User = require("./models/user");
const database = require("./models/database");
database;

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post(
  "/api/users",
  bodyParser.urlencoded({ extended: true }),
  (req, res) => {
    const username = req.body.username;
    User.findOne({ username })
      .then((user) => {
        if (user) throw new Error(`User ${username} already exists`);
        return User.insertMany({ username });
      })
      .then((user) => {
        console.log("Berhasil Ditambahkan");
        res.status(200).send({ user });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err.message);
      });
  }
); // TODO:DONE

app.post(
  "/api/excercise/add",
  bodyParser.urlencoded({ extended: true }),
  (req, res) => {
    let { userId, description, duration, date } = req.body;
    console.log(description);
    req.id = req.params.id;
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) throw new Error(`User ${userId} not found`);
        return ET.insertMany({ description, duration, date, userId });
      })
      .then((et) => {
        console.log("Berhasil Ditambahkan");
        res.status(200).send({ et });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err.message);
      });
  }
);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// ET.findOne();
