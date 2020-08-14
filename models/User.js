const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
require('dotenv').config();
mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

mongoose.connection.on('open', () => console.log('Mongoose connected'));
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', err => console.log(`Mongoose could not connect: ${err}`));

const userSchema = mongoose.Schema({
  user: String
});

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: '_id',
  startAt: 1000,
  incrementBy: 1
});

module.exports = mongoose.model('User', userSchema);