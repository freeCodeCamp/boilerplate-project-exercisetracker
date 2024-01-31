const User = require("../models/user");
const Exercise = require("../models/exercise");

/**
 *
 * Service for generate Log
 * @async
 * @function log Retrieve Log
 * @param {object} - Query Parameters
 * @returns {*} Log
 */
exports.log = async function (parameters) {
  const { user, date, limit } = parameters;
  const query = { user };

  try {
    if (date) query.date = date;

    const { _id, username } = await User.findOne({ _id: user });
    const log = await Exercise.find(query).limit(limit).populate({
      path: "user",
      select: "description, duration, date -_id",
    });

    return {
      _id,
      username,
      count: log.length,
      log,
    };
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * Service for Validate User ID
 * @async
 * @function validateUserID Validate User ID
 * @param {string} - User ID
 * @returns {*|Error} User validated
 */
exports.validateUserID = async function (id) {
  try {
    return await User.findOne({ _id: id });
  } catch (error) {
    throw new Error("Invalid User ID");
  }
};

/**
 *
 * Service for validate a Query
 * @async
 * @function validateQuery
 * @param {*} request
 * @returns {*|Error} Query validated
 */
exports.validateQuery = async function (request) {
  return new Promise((resolve, reject) => {
    try {
      const query = transform(request);
      resolve(query);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Validate and transform a request query
 *
 * @function transform
 * @param {*} request
 * @returns {*|Error} Request validated
 */
function transform(request) {
  let query = { user: request.params._id };

  if (isEmptyObject(request.query)) {
    return query;
  } else {
    try {
      query.date = {};
      const { from, to, limit } = request.query;

      if (from && isValidDate(from)) {
        query.date.$gte = new Date(from);
      }

      if (to && isValidDate(to)) {
        query.date.$lte = new Date(to);
      }

      if (limit) {
        query.limit = Number(limit);
      }

      return query;
    } catch (error) {
      throw new Error(error);
    }
  }
}

/**
 *
 * Validates a date string
 *
 * @function isValidDate
 * @param {string} date YYYY-MM-DD (ISO) format
 * @returns {boolean} True if correct date string
 */
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

/**
 *
 * Check for empty objects
 *
 * @function isEmptyObject
 * @param {*} object
 * @returns {boolean} True if object are empty
 */
function isEmptyObject(object) {
  for (const key in object) {
    return false;
  }
  return true;
}
