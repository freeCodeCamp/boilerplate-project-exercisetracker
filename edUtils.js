const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  username: String
});
const User = mongoose.model('User', userSchema);

const exerciseSchema = new mongoose.Schema({
  userId: String,
  description: String,
  duration: Number, // number of minutes
  date: Date
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

/**
 * Checks whether a date string is properly formatted as "[yy]yy-mm-dd"
 * @param {String} date
 * @returns nothing
 * @throws error if the date is not properly formatted
 */
function checkDate(date) {
  if (!/^((19|20|21)\d{2}|\d{2})-\d{1,2}-\d{1,2}$/.test(date)) {
    throw 'Invalid date';
  }
}

/**
 * Checks whether the exercise is valid and can be saved. If it does not
 * include a date it adds one.
 * @param {Object} exercise - Exercise to be checked.
 * @returns {Object} - Exercise with valid format
 * @throws - Error if the exercise is not valid
 */
function checkExercise(exercise) {
  return new Promise((resolve, reject) => {
    if (!exercise) {
      throw 'No exercise provided';
    } else if (!/^[0-9abcdef]{24}$/.test(exercise.userId)) {
      throw 'Invalid userId';
    } else if (!exercise.description) {
      throw 'Invalid description';
    } else if (!exercise.duration || isNaN(exercise.duration)) {
      throw 'Invalid duration';
    } else if (exercise.date) {
      checkDate(exercise.date);
    }
    let newExercise = { ...exercise }; // functions should not modify params
    newExercise.date = exercise.date ? new Date(exercise.date) : new Date();
    resolve(newExercise);
  });
}

/**
 * Creates a Mongoose filter to fetch the exercises of a particular user
 * @param {String} userId - User ID of the user who did the exercises
 * @param {date} from - Date from which fetching the exercises
 * @param {date} to - Date until which fecthing the exercises
 * @returns {Object} Object to be passed to a Moongose find filter
 */
function createExerciseFilter(userId, from, to) {
  let exerciseFilter = { userId };
  if (from) {
    exerciseFilter.date = {};
    exerciseFilter.date.$gt = from;
  }
  if (to) {
    exerciseFilter.date = exerciseFilter.date || {};
    exerciseFilter.date.$lt = to;
  }
  return exerciseFilter;
}

/**
 * Formats a date so it is recognized by the FCC parser.
 * @param {Date} date 
 * @returns {String} String of the date in format "Day MM DD YYYY"
 */
function dateToFccString(date) {
  let d = date.toUTCString().replace(",","").split(" ");
  return [d[0], d[2], d[1], d[3]].join(" ");
}

function getAllUsers() {
  return User.find();
}

function getUser(userId) {
  return User.findOne({ _id: userId })
    .then(userModel => {
      if (!userModel || !userModel.username) {
        throw ('User does not exist');
      }
      return userModel;
    });
}

/**
 * Fetch the exercises of a particolar user for a time period
 * @param {String} userId - MongoDB ID of the user
 * @param {Date} from - date from which to fetch the exercises
 * @param {Date} to - date until which to fetch the exercises
 * @param {Number} limit - Exercises to return
 * @returns user object with included exercises "logs:[]" and exercise count
 */
function getUserWithExercises(userId, from, to, limit) {
  return getUser(userId)
    .then(userModel => {
      let exerciseFilter = createExerciseFilter(userId, from, to);
      if (limit && isNaN(limit)) {
        throw 'Invalid limit';
      }
      return Exercise.find(exerciseFilter)
        .limit(limit ? Number(limit) : 0)
        .then(exercises => ({
          _id: userModel._id,
          username: userModel.username,
          count: exercises.length,
          log: exercises.map(exercise => ({
            _id: exercise._id,
            description: exercise.description,
            duration: exercise.duration,
            date: dateToFccString(exercise.date)
          }))
        }));
    });
}

/**
 * Saves a valid exercise
 * @param {Object} exercise 
 * @returns {Object} the user and exercise objects merged
 */
function saveExercise(exercise) {
  return getUser(exercise.userId)
    .then(userModel => {
      return new Exercise(exercise).save()
        .then(exerciseModel => ({
          _id: userModel._id,
          username: userModel.username,
          date: dateToFccString(exercise.date),
          duration: Number.parseInt(exercise.duration),
          description: exercise.description
        }));
    });
}

/**
 * Saves a user if it does not exist
 * @param {String} username
 * @returns {Object} the saved user object
 */
function saveUser(username) {
  return User.findOne({ username })
    .then(user => {
      if (user) {
        throw ('User exists');
      } else {
        return new User({ username }).save(); // _id is automatic
      }
    });
}

module.exports = {
  checkExercise,
  getAllUsers,
  getUserWithExercises,
  saveExercise,
  saveUser
}