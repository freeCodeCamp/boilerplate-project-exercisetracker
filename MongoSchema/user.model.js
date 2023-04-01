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
    const tempUser = {}
    for (const user of users) {
      tempUser.username = user.username
      tempUser._id = user._id
      listArray.push(tempUser)
    }
    console.log(listArray)

    return listArray
  } catch (error) {
    throw new Error(error)
  }
}

userSchema.index({ username: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)

// Export the model
module.exports = User
