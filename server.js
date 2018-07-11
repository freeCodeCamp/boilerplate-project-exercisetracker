const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const shortid = require('shortid');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// DB Settings
var Schema = mongoose.Schema;
var userSchema = new Schema({
  _id: {
    'type': String,
    'default': shortid.generate
  },
  username: String,
  count: Number,
  log: [{
    description: String,
    duration:    Number,
    date:        Date
  }]
}, { collection: 'users_exercises' });
var User = mongoose.model('User', userSchema);

app.get('/api/exercise/log', (req, res, next) => {
  var userId = req.query.userId || "",
      from   = req.query.from   || "",
      to     = req.query.to     || "",
      limit  = req.query.limit  || 0;

  if (userId) {
    User.findById(userId).exec((err, data) => {
      if (err) res.json(err);
      
      var newData = {
            _id:      data._id,
            username: data.username,
            log:      []
          };
      
      if (!limit) limit = data.log.length
      
      if (from) {
        newData.from = from;
        from = new Date(from);
      } else {
        from = new Date(0)
      }

      if (to) {
        newData.to = to;
        to = new Date(to);
      } else {
        to = new Date();
      }
      
      for (let i = 0; i < data.log.length; i++) {
        var date = new Date(data.log[i].date);

        if (date > from && date < to && newData.log.length < limit) {
          newData.log.push({
            duration:    data.log[i].duration,
            description: data.log[i].description,
            date:        date.toDateString()
          });
        }
      }
      
      newData.count = newData.log.length;

      res.json(newData);
    });
  } else {
    next({ status: 400, message: 'unknown userId' });
  }
});

app.post('/api/exercise/new-user', (req, res, next) => {
  User.findOne({ "username": req.body.username }).exec((err, data) => {
    if (err) res.json(err);

    if (data) {
      next({ status: 400, message: 'username already taken' });
    } else {
      User.create(req.body, function (err, data) {
        if (err) res.json(err);

        res.json({ _id: data._id, username: data.username });
      });
    }
  });
});

app.post('/api/exercise/add', (req, res, next) => {
  var userId      = req.body.userId      || "",
      description = req.body.description || "",
      duration    = req.body.duration    || "",
      date        = req.body.date        || "";

    date = new Date(date);

  User.findById(userId, function(err, data) {
    if (err) res.json(err);
    
    if (!data)        next({ status: 400, message: 'unknown _id' });
    if (!description) next({ status: 400, message: 'Path `description` is required.' });
    if (!duration)    next({ status: 400, message: 'Path `duration` is required.' });

    data.log.push({
      description: description,
      duration:    duration,
      date:        date
    });
    data.save(function (err) {
      if (err) res.json(err);
      
      res.json({
        username:    data.username,
        description: description,
        duration:    duration,
        _id:         userId,
        date:        date.format()
      });
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
    errCode = 400 // bad request
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
