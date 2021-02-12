const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const exerciseModel = require('../models/exerciseModel.js');

router.post('/add', (req, res) => {
  res.json({ message: "add exercise" })
})

router.get('/log', (req, res) => {
  res.json({ message: "getting exercise log"})
})

module.exports = router