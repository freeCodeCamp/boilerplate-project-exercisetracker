const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
require('dotenv').config();
mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('open', () => console.log('Mongoose connected'));
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', err => console.log(`Mongoose could not connect: ${err}`));

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'}]
});

const exerciseSchema = mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  dateDone: Date,
});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: '_id',
  startAt: 1000,
  incrementBy: 1
});

const user = mongoose.model('User', userSchema);
const exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = {user, exercise};