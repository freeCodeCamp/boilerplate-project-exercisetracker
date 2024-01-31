const service = require("../services/log");

/**
 *
 * Create new Log for a User
 *
 * @async
 * @function log - Controller for Log
 * @param {*} request
 * @param {*} response
 * @returns {*} Log data for an exercise
 */
exports.log = async function (request, response) {
  try {
    const log = await service.log(request.query);
    response.json(log);
  } catch (error) {
    response.json({ error });
  }
};

/**
 *
 * Validate User ID
 *
 * @async
 * @function validate - Controller for Log
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} Calls next when correct User ID
 */
exports.validateUserID = async function (request, response, next) {
  try {
    await service.validateUserID(request.params._id);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate Query parameters
 *
 * @async
 * @function validateQuery - Controller for Log
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} Calls next when correct Query parameters
 */
exports.validateQuery = async function (request, response, next) {
  try {
    request.query = await service.validateQuery(request);
    next();
  } catch (error) {
    next(error);
  }
};
