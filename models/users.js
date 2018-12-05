'use strict'

const shortid = require('shortid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Users = new Schema({
  username: {
    type: String, 
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
  },
  _id: {
    type: String,
    index: true,
    default: shortid.generate
  }
})

module.exports = mongoose.model('Users', Users)