const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = mongoose.Schema({

});

module.exports = mongoose.model('User', userSchema);