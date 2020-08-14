const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('open', () => console.log('Mongoose connected'));
mongoose.connection.on('error', err => console.log(`Mongoose could not connect: ${err}`));

const userSchema = mongoose.Schema({

});

module.exports = mongoose.model('User', userSchema);