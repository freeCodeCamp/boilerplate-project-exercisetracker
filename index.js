// @ts-check
/// //////////////////////////////////////////////////// Imports
const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
// const runMDB = require('./connectMDB')
// const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
const path = require('path')
// eslint-disable-next-line no-unused-vars
const router = require('express').Router()
// eslint-disable-next-line no-unused-vars
const color = require('colors')
const uri = process.env.MDBSRV || ''

const mainView = path.join(__dirname, '/views/index.html')

/// ////////////////////////////////////////////////// Funtions
function runMongoDB () {
  mongoose.connect(uri)
    // @ts-ignore
    // @ts-ignore
    .then((res) => console.log(' > Successfully connected to MongoDB'.bgWhite.gray))
    .catch((err) => console.log(` > Error while connecting to mongoDB : ${err.message}`.underline.red))
}

const server = app.listen(process.env.PORT || 3000, () => {
  // @ts-ignore
  const port = server.address().port
  console.log('Sever is listening to Port: ' + port)
})

const checkUsernameInput = (/** @type {{ body: { username: any; }; }} */ req, /** @type {{ redirect: (arg0: string) => any; }} */ res, /** @type {() => any} */ next) => {
  !req.body.username ? res.redirect(mainView) : next()
}

const dateCheck = (/** @type {{ body: { date: string; }; }} */ req, /** @type {{ redirect: (arg0: string) => void; }} */ res, /** @type {() => void} */ next) => {
  if (!req.body.date) {
    next()
  } else {
    const regEx = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/i
    const check = (typeof req.body.date === 'string' && req.body.date.search(regEx) > -1) || false
    if (!check) {
      console.log('Date is not in the correct YYYY-MM-DD format'.bgRed.black)
      res.redirect(mainView)
    } else {
      next()
    }
  }
}

/// ///////////////////////////////////////////////////// Import Schema
const User = require('./MongoSchema/user.model.js')
// @ts-ignore
// @ts-ignore
// eslint-disable-next-line no-unused-vars
const { error } = require('console')

/// ///////////////////////////////////////////////////// Start Mongo Server

runMongoDB()

/// ///////////////////////////////////////////////////// Middleware

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// @ts-ignore
// @ts-ignore
app.use((req, res, next) => {
  console.log(`${req.method} request received for URL: ${req.url}`)
  next()
})

/// //////////////////////////////////////////////////// GET

// @ts-ignore
// @ts-ignore
app.get('/', (req, res) => {
  res.sendFile(mainView)
})

// @ts-ignore
// @ts-ignore
app.get('/api/users', (req, res) => {
  // @ts-ignore
  User.getAllAsArray()
    .then((/** @type {Array} */ list) => {
      // console.log(list)
      res.send(list)
    })
    .catch((/** @type {any} */ err) => { console.log(err) })
})

// für nächsten GET benötigt
/* const savedUserLog = savedUser.log.map(obj => {
  return {
    description: obj.description,
    duration: obj.duration,
    date: postDateFormat(obj.date)
  } */


/// //////////////////////////////////////////////////// POST

app.post('/api/users', checkUsernameInput, (req, res) => {
  const newUser = new User({
    username: req.body.username
  })
  console.log(newUser)
  newUser.saveUser()
    .then(user => {
      console.log(`User ${user.username} saved successfully!`.bgGreen.black)
      res.json({ username: user.username, _id: user._id })
    })
    .catch(err => {
      if (err.code === 11000) { // duplicate Document
        console.log('User is already Existing'.bgRed.black)
        res.redirect(mainView)
      } else {
        console.log(err.code)
      }
    })
})

/**
 * @param {Date} date
 */
function postDateFormat (date) {
  const local = 'en-GB'
  let formatedDate = ''
  let day = date.toLocaleString(local, { day: 'numeric' }).toString()
  if (day.length === 1) { day = '0' + day }
  const dayNameShort = date.toLocaleString(local, { weekday: 'short' })
  const month = date.toLocaleString(local, { month: 'short' })
  const year = date.toLocaleString(local, { year: 'numeric' })

  formatedDate = formatedDate.concat(dayNameShort, ' ', month, ' ', day, ' ', year) // Mon Jan 01 1990
  return formatedDate
}
app.post('/api/users/:_id/exercises', dateCheck, async (req, res) => {
  await User.findById(req.params._id).exec()
    .then(user => {
      const nextLogNum = user?.log.length || 0
      // @ts-ignore
      user.log.push({
        description: req.body.description,
        duration: req.body.duration
      })
      if (req.body.date) {
        // @ts-ignore
        user.log[nextLogNum].date = req.body.date
      }
      user?.saveUser()
        .then(savedUser => {
          const log = savedUser.log[nextLogNum]
          const savedUserLog = {
            description: log.description,
            duration: log.duration,
            date: postDateFormat(log.date)
          }
          res.send({
            username: savedUser.username,
            _id: savedUser._id,
            log: savedUserLog
          })
        })
        .catch(err => {
          if (err.stack.includes('Cast to Number')) {
            console.log(' Duration is not a Number'.bgRed.black)
          } else
          if (err.stack.indexOf('`duration` is required') > -1) {
            console.log('Duration has no input value'.bgRed.black)
          } else
          if (err.stack.indexOf('`description` is required') > -1) {
            console.log('Description has no input value'.bgRed.black)
          } else {
            console.log(err)
          }
          res.redirect(mainView)
        })
    })
    .catch(err => {
      if (err.stack.startsWith('CastError')) {
        console.log('ObjektID ist nicht gefunden worden.'.bgRed.black)
      } else {
        console.log(err)
      }
      res.redirect(mainView)
    })
})
 
/// ////////////////////////////////////////////////// Other Stuff

try {
  console.log('='.repeat(50))
  console.log('Connected to MongoDB: ' + mongoose.connection.getClient().options.dbName.bgWhite.black)
  console.log('='.repeat(50))
} catch (error) {
  console.log('Keine Verbindung zum MongoDB Server'.bgRed.black)
}
