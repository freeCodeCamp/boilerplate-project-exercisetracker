const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

// Parse incoming JSON data
app.use(bodyParser.urlencoded({ extended: true }));

//connecting to the database
mongoose.connect(process.env.URL);

//creating userSchema model but i have named it excerciseSchema by mistake
const excerciseSchema = new mongoose.Schema({
  username: String,
  // exercisesArray: [{type: mongoose.Schema.Types.ObjectId, ref:'excerModel'}]
});

//creating userModel but i have named it excercise model by mistake
const excerciseModel = mongoose.model('excercise', excerciseSchema);


//this is the excercise Schema and model
const excerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date,
});

const excerModel = mongoose.model('user', excerSchema);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//creating new user
app.post("/api/users", async function (req, res) {
  const name = req.body.username;
  console.log(name);

  const user = new excerciseModel({ username: name });
  console.log(user.username);

  await user.save();

  res.status(200).json({ username: user.username, _id: user._id });
});

//get request to display all existing users
app.get("/api/users", async (req, res) => {

  const documents = await excerciseModel.find({}, "_id username");
  documents.forEach(document => {
    console.log(document.username);
  });
  res.status(200).json(documents);

});

//creating new exercise for a user
app.post("/api/users/:_id/exercises", async (req, res) => {
  const userid = req.params._id;
  const descrip = req.body.description;
  const dur = req.body.duration;
  const date = req.body.date;

  try {
    const user = await excerciseModel.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const excercise = new excerModel({
      userId: user._id, //user's objectId
      description: descrip,
      duration: dur,
      date: date ? new Date(date) : new Date(),
    });

    const savedExercise = await excercise.save();


    res.json({
      _id: user._id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: new Date(savedExercise.date).toDateString()
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/users/:_id/logs", async function (req, res) {

  const userId = req.params._id;
  const { from, to, limit } = req.query;

  try {
    const user = await excerciseModel.findById(userId);

    if (!user) {
      return res.json({ error: "user not found" });
    }

    let filter = { userId };
    let dateObj = {};

    if (from) {
      dateObj["$gte"] = new Date(from);
    }
    if (to) {
      dateObj["$lte"] = new Date(to);
    }

    if (from || to) {
      filter.date = dateObj;
    }

    let exercises = await excerModel.find(filter).limit(+limit || 500);

    const log = exercises.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log
    });

    
  } catch (error) {
    res.status(500).json({ error: "Internal sever error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
