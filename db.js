const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

console.log('database connection state: ', mongoose.connection.readyState)

module.exports = mongoose