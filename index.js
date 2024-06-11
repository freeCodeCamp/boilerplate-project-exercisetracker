const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))

let exerciseSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String
  },
  description: String,
  duration: Number,
  date: String,
  _id: Number
});

let userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String
  }
});

let Exercise = mongoose.model('Exercise', exerciseSchema);
let User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', async (req, res, next) => {
  let user = new User({ username: req.body.username })
  user = await user.save();
  next();
}, async (req, res) => {
  const query = await User.find({username: req.body.username}).exec();
  res.json({ "username": query[0].username, "_id": query[0]._id })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
