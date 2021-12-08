const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect("mongodb+srv://aviglazer:Password123@cluster0.bb2t7.mongodb.net/ExerciseMS?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const exercisesSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});

const userSchema = new Schema({
  username: { type: String, required: true },
  log: [exercisesSchema]
})

let Exercises = mongoose.model('Exercises', exercisesSchema);
let User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', (req, res) => {
  User.find({}, (err, list) => {
    if (!err) res.json(list);
  })
})

app.post('/api/:username', (req, res) => {
  const newuser = new User({ username: req.body.username });
  newuser.save((err, data) => {
    if (!err) {
      let resobj = {
        username: data.username,
        _id: data.id
      };
      res.json(resobj);
    }
  })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const newexec = new Exercises({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })
  if (newexec.date == '') newexec.date = new Date().toDateString();

  User.findByIdAndUpdate(req.params._id, { $push: { log: newexec } }, { new: true }, (err, updated) => {
    if (!err) {
      res.json({
        _id: req.params._id,
        username: updated.username,
        description: newexec.description,
        duration: newexec.duration,
        date: new Date(newexec.date).toDateString()
      })
    }
  })
})

app.get('/api/users/:_id/logs', (req, res) => {
  User.findById(req.params._id, (err, data) => {
    if (!err) {
      let editdata = data.log;
      let thisisstupid = [];
      for (let x of editdata) {
        let datec = new Date(x.date);
        if (datec == "Invalid Date") {
          datec = new Date()
        }
        let jsonobj = {
          description: x.description,
          duration: x.duration,
          date: datec.toString()
        }
        thisisstupid.push(jsonobj)
      }

      if (req.query.limit) thisisstupid = thisisstupid.slice(0, req.query.limit)
      if (req.query.from) {
        let dfrom = new Date(req.query.from);
        thisisstupid = thisisstupid.filter((d) => {
          let newD = new Date(d.date).getTime()
          return newD >= dfrom
        })
      }
      if (req.query.to) {
        let dto = new Date(req.query.to);
        thisisstupid.filter((d) => {
          let newD = new Date(d.date).getTime()
          return newD <= dto
        })
      }
      for (let x of thisisstupid) {
        let whydoesntthiswork = new Date(x.date);
        x.date = whydoesntthiswork.toDateString();
      }
      res.json({
        _id: req.params._id,
        username: data.username,
        count: data.log.length,
        log: thisisstupid
      })
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
