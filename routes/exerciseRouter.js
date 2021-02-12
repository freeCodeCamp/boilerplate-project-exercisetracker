const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
const exerciseModel = require('../models/exerciseModel.js');
const userModel = require('../models/userModel.js');

router.post('/add', (req, res) => {
  let body = req.body;
  userModel.find({_id: body.userid}, (err, result) => {
    if (result == 0) res.json({error: 'no user matching given ID'})
    else {
      let user = result[0]
      let newExercise = new exerciseModel({
        userId: body.userid,
        description: body.description,
        duration: body.duration,
        date: body.date == 0 ? Date.now() : body.date
      });
      newExercise.save((err, data) => {
        if (err) return res.json({err})
        else res.json({ message: "added exercise", data });
        console.log('adding ' + data)
      })
    }
  });
});

router.get('/log', (req, res) => {
  userModel.find({_id: req.query.userid}, (err, log) => {
    if (log == 0) res.json({error: 'no user matching given ID'});
    else {
      res.json({ log });
    }
  });
});

module.exports = router