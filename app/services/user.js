const User = require("../models/user");

/**
 *
 * @async
 * @function
 * @param {string} username
 * @returns {*} User
 */
exports.createUser = async function (username) {
  try {
    return await User.create({ username });
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * Service for retrieve all Users
 *
 * @async
 * @function getUsers - Get all users
 * @returns {*} All Users
 */
exports.getUsers = async function () {
  try {
    return await User.find({}).lean();
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * Service for validate an User ID
 *
 * @async
 * @function validateUserID - Validate User ID
 * @param {string} id User id
 * @returns {*|Error} User ID validated
 */
exports.validateUserID = async function (id) {
  try {
    return await User.findOne({ _id: id });
  } catch (error) {
    throw new Error("Invalid User ID");
  }
};
