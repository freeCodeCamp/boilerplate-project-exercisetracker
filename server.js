const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { User, Exercise } = require('./models/User.js');

const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`)
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

app.post('/api/exercise/new-user', (request, response, next) => {
  const userNameInput = request.body.username;
  User.findOne({username: userNameInput})
      .then(queriedUser => {
        if(!queriedUser){
           const user = new User({username: userNameInput});
           return user.save();
        } else {
          return Promise.reject({status: 400, message: 'User already exists'});
        }
      })
      .then(user => {
        response.json({_id:user._id, username: user.username});
      })
      .catch(error => {
        next({status: error.status, message: error.message});
      })
});

app.post('/api/exercise/add', (request, response, next) => {
  const requestBody = request.body;
  User.findOne({_id: requestBody.userId})
      .then(queriedUser => {
        const duration = requestBody.duration;
        const description = requestBody.description;
        const date = requestBody.date ? new Date(requestBody.date) : new Date();
        const exercise = new Exercise({user: queriedUser, duration, description, date});
        exercise.save();
        queriedUser.exercises.push(exercise);
        return queriedUser.save();
      })
      .then(user => {
        response.json({_id: user._id, username: user.username, exercises: user.exercises});
      })
      .catch(error => {
        next({status: error.status, message: error.message});
      })
})

app.get('/api/exercise/users', (request, response, next) => {
  User.find({}).select("-__v")
  .then(users => {
    response.json(users);
  })
  .catch(error => {
    next({status: error.status, message: error.message});
  })
});

app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
     .send(errMessage)
})