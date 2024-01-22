const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Check connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", console.log.bind(console, "MongoDB connection established !"));

// Schema
const userSchema = new mongoose.Schema({
  username: String,
});
const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});
// Model
const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// POST New User
app.post("/api/users/", async (req, res) => {
  const usernameInput = req.body.username;
  const existingUser = await User.findOne({ username: usernameInput }).exec();
  if (existingUser) {
    res.json({ username: existingUser.username, _id: existingUser._id });
  } else {
    const user = new User({ username: usernameInput });
    user.save();
    res.json({ username: user.username, _id: user._id });
  }
});
// GET All users
app.get("/api/users/", async (req, res) => {
  const users = await User.find().select("username _id");
  console.log(users);
  res.json(users);
});
// POST new Exercice
app.post("/api/users/:_id/exercises/", async (req, res) => {
  const userId = req.params._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date ? new Date(req.body.date) : new Date();

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.json({ error: "User not found" });
    } else {
      const exerciseObj = new Exercise({
        username: user.username,
        description: description,
        duration: duration,
        date: date,
      });
      const savedExercise = await exerciseObj.save();
      res.json({
        _id: user._id,
        username: user.username,
        date: savedExercise.date.toDateString(),
        duration: savedExercise.duration,
        description: savedExercise.description,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET Logs
app.get("/api/users/:_id/logs", async (req, res) => {
  const userId = req.params._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.json({ error: "User not found" });
    } else {
      const { from, to, limit } = req.query;
      const dateFilter = {};
      if (from) {
        dateFilter.$gte = new Date(from);
      }
      if (to) {
        dateFilter.$lte = new Date(to);
      }
      const exerciseQuery = { username: user.username };
      if (Object.keys(dateFilter).length > 0) {
        exerciseQuery.date = dateFilter;
      }
      const exerciseQueryWithLimit = limit
        ? Exercise.find(exerciseQuery).limit(parseInt(limit))
        : Exercise.find(exerciseQuery);

      const logs = await exerciseQueryWithLimit
        .select("description duration date")
        .lean();
      logs.forEach((log) => {
        log.date = log.date.toDateString();
      });
      res.json({
        _id: user._id,
        username: user.username,
        count: logs.length,
        log: logs,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
