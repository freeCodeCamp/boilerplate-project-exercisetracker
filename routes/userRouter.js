const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
const userModel = require('../models/userModel.js');


router.post('/new-user', (req,res) => {
  let newUsername = req.body.username;
  userModel.find({username: newUsername}, (err, results) => {
    if (err) console.error(err);
    if (results == 0) {
      let newUser = new userModel({ username: newUsername })
      newUser.save();
      res.json({ newUser: newUser });
    } else {
      res.json({ message: 'database already contains username' });
    };
  });
});

router.get('/users', (req,res) => {
  userModel.find({}, (err,results) => {
    if (err) return console.error(err)
    res.json({ results })
  })
});

module.exports = router;