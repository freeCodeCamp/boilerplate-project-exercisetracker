const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userModel = require(_dirname + "/exerciseModels.js");

//creating an endpoint for the username
app.post('api/exercise/new-user', (req, res) => {
  let newUser = req.body.username; 
  if (username){
    let data = new user({
      username: userInput,
      userId: newUserId 
    })

    data.save(err=>{
      if (err){
        return res.send("Error saving username to database");
      }
    });

    return res.json(data);
  } 
    let data = new user({
      username: "User name is not valid",
      userId: "Invalid username"
    })

    return res.json(data); 
});

app.post('/api/exercise/add', (req, res) => {

})

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
