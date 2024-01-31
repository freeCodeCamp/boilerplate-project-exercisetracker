const { connect, Mongoose } = require("mongoose");

const URI = process.env.MONGO_URI;

/**
 *
 * Connect to Mongo Database
 *
 * @async
 * @function connection
 * @returns {Promise<Mongoose>|Error} Connection to Mongo DB
 */
exports.connectToDatabase = async function () {
  try {
    await connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.error(error);
  }
};
