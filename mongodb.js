const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGO_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {console.log('mongoDB connected!!')})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    date: {
        type: String,
    },
    duration: {
        type: Number,
    },
    description: {
        type: String,
    },
    count: {
        type: Number,
    },
    log: {
        type: [Object],
    }
})
// userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('User', userSchema)
