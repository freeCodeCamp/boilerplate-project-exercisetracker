const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const ERR_USER_NOTFUND = {error: 'user not found'};

mongoose.set('useFindAndModify', false);

app.use(cors());
app.use("/public", express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));


// log for debugging
/*
app.use((req, res, next) => {
  console.log(`LOG: ${req.method} ${req.path}`);
  // if (req.method === 'POST') {
  //   console.log('  body:', req.body);
  // } else {
  //   console.log(' params:', req.params);
  // }
  next();
});
*/
// ---------------------- MongoDB ------------------------------
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .catch(err => {
    console.error('Cannot connect to mongoDB', err);
  });

const defaultDate = () => new Date().toISOString().slice(0, 10);

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: false },
    exercices: [
      {
        description: { type: String },
        duration: { type: Number },
        date: { type: String, required: false }
      }
    ]
  }
);
const User = mongoose.model('Users', userSchema);

// create and save user (OK)
function addUser(req, res) {
  let username = req.body.username;
  if (!username || username.length === 0) {
    res.json({ error: "Invalid username" });
  }
  const user = new User({ username: username });
  user.save(function (err, newUser) {
    if (err) {
      return console.log('addUser() error saving new user:', err);
    }
    res.json({ username: newUser.username, _id: newUser._id });
  });
}

// get all users (OK)
function getAllUsers(req, res) {
  User.find()
    .select('username _id')
    .exec(function (err, userList) {
      if (err) {
        return console.log('getAllUsers() error:', err);
      }
      res.json(userList);
    });
}
/*
You can POST to /api/users/:_id/exercises with form data 'description', 'duration', and optionally 'date'. 
If no date is supplied, the current date will be used. 
The response returned will be the user object with the exercise fields added.
*/
function addExercise(req, res) {
  const userId = req.params.userId || req.body.userId; // userId from URL or from body
  const exObj = { 
    description: req.body.description,
    duration: +req.body.duration,
    date: req.body.date || defaultDate()
  }; // exrecise object to add
  User.findByIdAndUpdate(
    userId, // find user by _id
    {$push: { exercices: exObj } }, // add exObj to exercices[]
    {new: true},
    function (err, updatedUser) {
      if(err) {
        return console.log('update error:',err);
      }
      let returnObj = {
        username: updatedUser.username,
        description: exObj.description,
        duration: exObj.duration,
       _id: userId,
        date: new Date(exObj.date).toDateString()
      };
      res.json(returnObj);
    }
  );
}

// get Logs
function getLog(req, res) {
  let userId = req.params["_id"];
  let dFrom = req.query.from || '0000-00-00';
  let dTo = req.query.to || '9999-99-99';
  let limit = +req.query.limit || 10000;
  User.findOne({ _id: userId }, function (err, user) {
    if (err) {
      return console.log('getLog() error:', err);
    }
    try {
      let e1 = user.exercices.filter(e => e.date >= dFrom && e.date <= dTo);
      let e2 = e1.map(e => (
          {
            description: e.description, 
            duration: e.duration, 
            date: e.date //new Date(e.date).toDateString()}
          }
          ));
      let ex = user.exercices.filter(e => e.date >= dFrom && e.date <= dTo)
        .map(e => (
          {
            description: e.description, 
            duration: e.duration, 
            date: e.date //new Date(e.date).toDateString()}
          }
          ))
        .slice(0,limit);
      let logObj = {};
      logObj.count = ex.length;
      logObj._id = user._id;
      logObj.username = user.username;
      logObj.log = ex;
      res.json(logObj);
    } catch (e) {
      console.log(e);
      res.json(ERR_USER_NOTFUND);
    }
  });
}

// ------------------- main API ------------------------
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
// в index.html и в задании разные URL, так что оба варианта
app.post("/api/users", addUser); // в задании
app.post("/api/exercise/new-user", addUser); // в html

app.get ("/api/users", getAllUsers); // в задании
app.get ("/api/exercise/users", getAllUsers); // на всякий случай

app.post("/api/exercise/add", addExercise); // не работает, т.к. приходит говно в виде POST /api/users/607acd7ff7b903021aade681/exercises
app.all("/api/users/:userId/exercises", addExercise); // для post() параметры не работают - х.з. как сделать

app.get("/api/exercises/:userId/log", getLog);
app.get("/api/users/:_id/logs", getLog);




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
