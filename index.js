const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const exerciseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date },
    user_id: { type: String, required: true },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.route("/api/users")
    .post(async (req, res) => {
        const username = req.body.username;
        const newUser = new User({ username: username });
        const result = await newUser.save();
        return res.json(result);
    })
    .get(async (req, res) => {
        const users = await User.find();
        return res.json(
            users.map((user) => ({ username: user.username, _id: user._id }))
        );
    });

app.post("/api/users/:_id/exercises", async (req, res) => {
    const user_id = req.params._id;
    const { description, duration, date } = req.body;

    const user = await User.findById(user_id);

    const newExercise = new Exercise({
        description,
        duration,
        date: date ? date : new Date(),
        user_id,
    });

    //   {
    //   username: "fcc_test",
    //   description: "test",
    //   duration: 60,
    //   date: "Mon Jan 01 1990",
    //   _id: "5fb5853f734231456ccb3b05"
    // }

    const result = await newExercise.save();
    return res.json({
        username: user.username,
        description: result.description,
        duration: result.duration,
        date: result.date.toDateString(),
        _id: result.user_id,
    });
});

app.get("/api/users/:_id/logs", async (req, res) => {
    const { from, to, limit } = req.query;
    const user_id = req.params._id;

    let filter = { user_id: user_id };
    let dateFilter = {};

    if (from) {
        dateFilter["$gte"] = new Date(from);
    }
    if (to) {
        dateFilter["$lte"] = new Date(to);
    }
    if (from || to) {
        filter.date = dateFilter;
    }

    const user = await User.findById(user_id);
    let exercises = await Exercise.find(filter).limit(limit ? limit : null);
    exercises = exercises.map((e) => ({
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString(),
    }));
    return res.json({
        username: user.username,
        count: exercises.length,
        _id: user._id,
        log: exercises,
    });
});

mongoose
    .connect(process.env.url)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Your app is listening on port");
        });
    })
    .catch((err) => console.log("Error", err));
