const db = require('../db')
const Schema = db.Schema;

const exerciseSchema = new Schema({
  userId: String,
  duration: String,
  description: String,
  date: Date
});
const exerciseModel = db.model('exercise', exerciseSchema);

module.exports = exerciseModel;