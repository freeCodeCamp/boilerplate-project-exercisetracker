// Strart by requiring the needed packages
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const shortid = require('shortid')
require('dotenv').config()

// Call the connectToDatabase function to initialize connection to MongoDB
connectToDatabase();

// Define the user schema including an array of logs referencing the Exercise schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  _id: { type: String, default: shortid.generate },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});

// Define the exercise schema with user id, description, duration and date fields
const ExerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Create user and exercise models
const User = mongoose.model('User', UserSchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);

// Add middleware to enable cross-origin resource sharing and parsing of URL-encoded bodies
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Serve the static html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// User registration
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  try {
    const user = new User({ username });
    await user.save();
    res.json({ username: user.username, _id: user._id });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//Get all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Post exercise data for a user id
app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  try {
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");
    const newExercise = new Exercise({ userId: user._id, description, duration, date });
    await newExercise.save();
    user.logs.push(newExercise._id);
    await user.save();
    res.json({
      _id: user._id,
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date ? newExercise.date.toDateString() : (new Date()).toDateString() // check if date is set
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Get log of exercises for a user
app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id).populate({
      path: 'logs',
      match: {
        ...(from && { date: { $gte: new Date(from) } }),
        ...(to && { date: { $lte: new Date(to) } }),
      },
      options: {
        ...(limit && { limit: parseInt(limit) }),
      },
    });

    if (!user) throw new Error("User not found");

    const exerciseLog = user.logs.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date ? exercise.date.toDateString() :
        (new Date()).toDateString()// check if date is set
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: user.logs.length,
      log: exerciseLog,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Start the server on desired port
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// Function to connect to MongoDB using mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database', error);
  }
}
