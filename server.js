const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const shortid = require('shortid');

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


app.get('/api/exercise', (req,res) => {
  res.send('Hello Exercise');
  res.end();
});
app.post('/api/exercise/new-user', (req, res) => {
  var userName = req.body.username;
  console.log(userName);
  MongoClient.connect(process.env.MONGO_URL, (err,db) => {
    if (err) return console.log('the eroor is ', err);
    var dbo = db.db('medicine');
    
    dbo.collection('exercisers').find({username: userName}).toArray((error,result) => {
      if (error) throw error;
      else {
        if (result.length !== 0){
          console.log(result[0]);
          res.send('username already taken');
        } else {
          var okay = shortid.generate();
          var userObj = {username: userName, _id: okay, exercises: []};
          dbo.collection('exercisers').insertOne(userObj, (error,ok) => {
            if (error) throw error;
            console.log('1 user inserted');
            res.json(userObj);
          });
        }
        db.close();
      }
    });
  });
});

app.post('/api/exercise/add', (req, res) => {
  var userId = req.body.userId;
  var description = req.body.description;
  var date = req.body.date;
  date = new Date(date).toDateString();
  var duration = req.body.duration;
  var update = {$push: {"exercises": {description: description, date : date, duration: duration}}};
  
  console.log(userId);
  MongoClient.connect(process.env.MONGO_URL, (err,db) => {
    if (err || userId === '') return res.send('Error 404. Please check your user Id and try again later');
    var dbo = db.db('medicine');
    
    dbo.collection('exercisers').findOne({_id:userId}, (err,response) => {
      console.log(response);
      if(err || response === null) {
        res.send('Error 404. Please check your user Id and try again later');
        db.close();
        throw err;
      }
      dbo.collection('exercisers').updateOne({_id:userId}, update, (err,ok) => {
            if(err) throw err;
            console.log('Update successful');
          });
      dbo.collection('exercisers').findOne({_id:userId}, (err,response) => {
        if (err) throw err;
        console.log(response);
        res.send(response);
        db.close();
      });
    });
  });
});

app.get('/api/exercise/log', (req,res) => {
  let {userId, from, to, limit} = req.query;
  
  from = new Date(from).toDateString();
  to = new Date(to).toDateString();
  limit = Number(limit);
  //res.send(from);
  MongoClient.connect(process.env.MONGO_URL, (err,db) => {
    if (err) throw err;
    const dbo = db.db('medicine');
    
    dbo.collection('exercisers').find({_id: userId}).limit(limit).toArray((err,response) => {
    if (err) {
      res.send('Error 404. Please check your user Id and try again later');
      db.close();
    } else {
      console.log(response);
      // this is where the magic happens
      //Now try to handle the from request
        response[0].exercises.sort((a,b) => {
        	if (new Date(a.date) > new Date(b.date)) return 1;
        	if (new Date(a.date) < new Date(b.date)) return -1;
        });
      
      var worker = response[0].exercises;
      
      var indexStart = 0, indexEnd = 0;
      for (var i = 0; i < worker.length; i++){
        if (worker[i].date == from){
          indexStart = i
        }
      }
      
      for (var i = 0; i < worker.length; i++){
        if (worker[i].date == to){
          indexEnd = i
        }
      }
      
      console.log('The index is ', indexEnd)
      var complete;
      if (indexEnd !== 0) {
       complete = worker.slice(indexStart,indexEnd) 
      } else {
       complete = worker.slice(indexStart) 
      }
      
      if (limit) {
        complete = complete.slice(0,limit)
        console.log('The complete stuff is ', complete);
      }
      res.send(complete);
      // console.log(complete);
      } 
    });
  });
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'});
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 40; // bad request;
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
