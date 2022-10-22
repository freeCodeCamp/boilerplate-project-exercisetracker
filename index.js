const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded());
app.use(express.json());

const url = `mongodb+srv://rahulkumarmongo:helloRahulKumarMongo@cluster0.0pvpt.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
  useUnifiedTopology: true 
}

mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//create database schema
const User = new mongoose.Schema({
  username: String,
  log: [{
    description: String,
    duration: Number,
    date: String
  }]
});

const UserModel = mongoose.model('UserModel', User);



app.post("/api/users", (req, res) => {
  const username = req.body.username;
  // console.log(req.body);
  const object = new UserModel({username: username});
  object.save()
    .then(doc => {
      res.json({
        username: doc.username,
        _id: doc.id
      });
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/users", async (req, res) => {
  const allUsers = await UserModel.find();
  allUsers.forEach((element, index) => {
    allUsers[index] = {
      username: element.username,
      _id: element.id
    }
  });
  res.json(allUsers);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id;
  let {description, date, duration} = req.body;
  if(date === ''){
    date = new Date().toDateString();
  }
  UserModel.findByIdAndUpdate(id,
                              {"$push" : {"log" : {
                                description: description,
                                date: date,
                                duration: duration
                              }}}
            ,(err, data) => {
              if(err){
                res.json({
                  error: "update error" + err
                });
              }
              res.json({
                _id : data.id,
                username: data.username,
                description: description,
                date: date,
                duration: duration
              });
            });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const id = req.params._id;
  let {description, date, duration} = req.body;
  if(date === ''){
    date = new Date();
  }
  UserModel.findById(id, (err, data) => {
    if(err) res.json({
      error : err
    });

    const logs = data.log.map(recode =>  {
      return {description : recode.description,
      duration : recode.duration,
      date : recode.date}
    })

    res.json({
      _id: data.id,
      username: data.username,
      count: data.log.length,
      log: logs
    });
  });
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
