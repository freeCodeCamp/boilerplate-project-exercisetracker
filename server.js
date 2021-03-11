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
    res.json(savedUser)
  }).catch(err => {
    res.status(500).send(err.message)
  })
})

app.get('/api/exercise/users', (req, res) => {
  User.find()
  .then(user => {
    res.json(user)
  })
  .catch(err => {
    res.status(500).send(err.message)
  })
})

app.post('/api/exercise/add', (req, res) => {
  const body = req.body

  User.findByIdAndUpdate(body.userId, {
      description: body.description,
      duration: body.duration,
      date: body.date || new Date,
  }, {new: true})
  .then(updateuser => {
    res.json(updateuser)
  }).catch(err => {
    res.status(500).send(err.message)
  })
})


app.get('/api/exercise/log', (req, res) => {
  User.find()
  .then(user => {
    res.json(user[0].exercises)
  })
  .catch(err => {
    res.status(500).send(err.message)
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
