const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./db')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userRouter = require('./routes/userRouter')
const exerciseRouter = require('./routes/exerciseRouter')

app.use('/api/exercise', userRouter, exerciseRouter)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
