const service = require("../services/exercise");

/**
 *
 * Create new Exercise for a User
 *
 * @async
 * @function createExercise - Controller for Exercise
 * @param {*} request
 * @param {*} response
 * @returns {*} Exercise created
 */
exports.createExercise = async function (request, response) {
  try {
    const exercise = await service.createExercise(request.body);
    response.json(exercise);
  } catch (error) {
    response.json({ error });
  }
};
