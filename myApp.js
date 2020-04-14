const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI  || 'mongodb://localhost/exercise-track' , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const Schema = mongoose.Schema;


module.exports = {

};
