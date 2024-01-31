const service = require("../services/user");

/**
 *
 * Get all Users
 *
 * @async
 * @function getUsers - Controller for User list generation
 * @param {*} request
 * @param {*} response
 * @returns {Array<*>} All Users list
 */
exports.getUsers = async function (request, response) {
  try {
    const users = await service.getUsers();
    response.json(users);
  } catch (error) {
    response.json({ error });
  }
};

/**
 *
 * Create User
 *
 * @async
 * @function createUser - Controller for User creation
 * @param {*} request
 * @param {*} response
 * @returns {*} New User created
 */
exports.createUser = async function (request, response) {
  try {
    const user = await service.createUser(request.body.username);
    response.json(user);
  } catch (error) {
    response.json({ error });
  }
};

/**
 *
 * Validate User ID
 *
 * @async
 * @function validateUserID - Controller for User validation
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns {*} Calls next when correct User ID
 */
exports.validateUserID = async function (request, response, next) {
  try {
    const { _id } = await service.validateUserID(request.params._id);
    request.body.user = _id;
    next();
  } catch (error) {
    next(error);
  }
};
