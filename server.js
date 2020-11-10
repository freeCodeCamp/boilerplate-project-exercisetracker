const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
