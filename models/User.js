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

const Schema = mongoose.Schema;
const userSchema = Schema({
  username: {type: String, required: true},
  exercises: [{type: Schema.Types.ObjectId, ref: 'Exercise'}]
});

const exerciseSchema = Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: '_id',
  startAt: 1000,
  incrementBy: 1
});

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = {User, Exercise};