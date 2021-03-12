const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const User = require('./mongodb')

const bodyParser = require("body-parser");

app.use(bodyParser())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res) => {
  const body = req.body
  const user = new User({
    username: body.username
  })
  user.save()
  .then(savedUser => {
    res.json({
      _id: savedUser._id,
      username: savedUser.username 
    })
  }).catch(err => {
    res.status(500).send(err.message)
  })
})

app.get('/api/exercise/users', (req, res) => {
  User.find().select({_id: 1, username: 1})
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(500).send(err.message)
  })
})

app.post('/api/exercise/add', async (req, res) => {
  const body = req.body
  let currentDate;
  if(body.date) {
    currentDate = new Date(body.date).toDateString()
  } else {
    currentDate = new Date().toDateString()
  }
  let prevUserLogArray = await User.findById(body.userId).then(prevUser => {return prevUser.log})
  User.findByIdAndUpdate(body.userId, {
      description: body.description,
      duration: Number(body.duration),
      date: currentDate,
      log: 
      prevUserLogArray.concat([{
        description: body.description,
        duration: Number(body.duration),
        date: currentDate,
      }])
  }, {new: true}).select({log: 0})
  .then(updateuser => {
    res.json(updateuser)
  }).catch(err => {
    res.status(500).send(err.message)
  })
})


app.get('/api/exercise/log', (req, res) => {
  const id = req.query.userId;

  User.findById(id).select({_id: 1, username: 1, log: 1})
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(500).send(err.message)
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
