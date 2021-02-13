const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
const exerciseModel = require('../models/exerciseModel.js');
const userModel = require('../models/userModel.js');

router.post('/add', (req, res) => {
  let body = req.body;
  body.date = body.date == 0 ? (new Date()).toUTCString() : body.date;
  userModel.find({_id: body.userId}, (err, result) => {
    if (err) return res.json({ err })
    if (result == 0) res.json({error: 'no user matching given ID'})
    else {
      let user = result[0]
      let newExercise = new exerciseModel({
        userId: body.userId,
        username: user.username,
        date: body.date,
        duration: Number(body.duration),
        description: body.description
      });
      newExercise.save((err, data) => {
        if (err) return res.json({err})
        else res.json({
          _id: user["_id"],
          username: user.username,
          date: body.date,
          duration: Number(body.duration),
          description: body.description
        });
      });
    };
  });
});

router.get('/log', (req, res) => {
  exerciseModel.find({userId: req.query.userId}, 'description username duration date', (err, log) => {
    if (log == 0) res.json({error: 'no user matching given ID'});
    else {
      res.json({
        _id: req.query.userId,
        username: log[0].username,
        count: log.length,
        log: log 
      });
    };
  });
});

module.exports = router