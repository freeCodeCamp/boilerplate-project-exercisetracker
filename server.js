const express = require("express");
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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
