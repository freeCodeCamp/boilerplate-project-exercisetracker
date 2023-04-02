// @ts-check
const mongoose = require('mongoose')

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  log: [{
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
},
{
  methods: {
    saveUser () {
      const user = this
      return user.save()
    }
  }
})

userSchema.statics.getAllAsArray = async function () {
  try {
    // @ts-ignore
    const users = await this.find({})
    const listArray = []
    for (const user of users) {
      listArray.push({
        username: user.username,
        _id: user._id
      })
    }
    return listArray
  } catch (error) {
    throw new Error(error)
  }
}

userSchema.index({ username: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

// Export the model
module.exports = User
