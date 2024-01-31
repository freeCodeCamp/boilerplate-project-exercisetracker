const User = require("../models/user");
const Exercise = require("../models/exercise");

/**
 *
 * Service for create new Exercise
 *
 * @async
 * @function createExercise - Create an Exercise
 * @param {*} id
 * @param {*} exercise
 * @returns {*} New Exercise
 */
exports.createExercise = async function (exercise) {
  try {
    const newExercise = await Exercise.create(exercise);
    return await Exercise.findOne({ _id: newExercise._id }).populate({
      path: "user",
      select: "username",
    });
  } catch (error) {
    console.error(error);
  }
};
