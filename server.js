const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
// Read only if you are planning to use this boilerplate with repl.it
// repl.it doesnt have mangodb integration, you need to sign up for MLAB.com/mongodb.com
// you will get a free 500mb mongodb database and once signed up and setup is complete
// you can get a connection URL, which you can save in .env file and only then this boilerplate works with repl.it
// save in .env file ----->
// MLAB_URI= {connection url you get from mlab}
// e.g.
// MLAB_URI = mongodb+srv://{username}:{password}@cluster0.cnhsd.mongodb.net/{database-collection}?retryWrites=true&w=majority
mongoose.connect(process.env.MLAB_URI)

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
