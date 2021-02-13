const db = require('../db')
const Schema = db.Schema;

const exerciseSchema = new Schema({
  userId: { type: String, required: true},
  username: { type: String, required: true},
  duration: { type: Number, required: true},
  description: { type: String, required: true},
  date: { type: Date, default: Date.now() }
});
const exerciseModel = db.model('exercise', exerciseSchema);

module.exports = exerciseModel;