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
      .catch(error => next({status: error.status, message: error.message}));
});

app.post('/api/exercise/add', (request, response, next) => {
  const requestBody = request.body;
  const duration = requestBody.duration;
  const description = requestBody.description;
  const date = requestBody.date ? new Date(requestBody.date) : new Date();
  const exerciseEntered = {duration, description, date};
  User.findOne({_id: requestBody.userId})
      .then(queriedUser => {
        if(!queriedUser){
          return Promise.reject({status: 400, message: 'User does not exist'});
        }
        const exercise = new Exercise({user: queriedUser, ...exerciseEntered});
        exercise.save();
        queriedUser.exercises.push(exercise);
        return queriedUser.save();
      })
      .then(user => {
        response.json({
          _id: user._id, 
          username: user.username, 
          exercise: exerciseEntered
        });
      })
      .catch(error => next({status: error.status, message: error.message}));
})

app.get('/api/exercise/users', (request, response, next) => {
  User.find({}).select('-__v')
  .then(users => {
    if(!users){
      return Promise.reject({status: 400, message: 'No users found'});
    }
    response.json(users);
  })
  .catch(error => next({status: error.status, message: error.message}));
});

app.get('/api/exercise/log', (request, response, next) => {
  const userId = request.query.userId;
  User.findById({_id: userId}).select('-v').populate('exercises')
      .then(queriedUser => {
        if(!queriedUser){
          return Promise.reject({status: 400, message: 'No users found'});
        } else if(!queriedUser.exercises.length){
          return Promise.reject({status: 400, message: 'No exercises found'});
        }
        response.json({
          _id: queriedUser._id, 
          username: queriedUser.username, 
          exercises: queriedUser.exercises.map(exercise => ({
            duration: exercise.duration,
            description: exercise.description,
            date: exercise.date
          })), 
          count: queriedUser.exercises.length});
      })
      .catch(error => next({status: error.status, message: error.message}));
});

app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
});

// Error Handling middleware
app.use((error, request, response, next) => {
  let errorCode, errorMessage
  if (error.errors) {
    // mongoose validation error
    errorCode = 400 // bad request
    const keys = Object.keys(error.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errorCode = err.status || 500;
    errorMessage = error.message || 'Internal Server Error'
  }
  response.status(errorCode).type('txt')
          .send(errorMessage)
});