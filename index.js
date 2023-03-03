
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
require('dotenv').config();


app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

let users = [];
let exercises = [];

app.get('/api/users', (req, res) => {
  res.json(users);
});


app.post('/api/users', (req, res) => {
  
  const username = req.body.username;

  if (username !== "") {

    const id = crypto.createHash('sha1').update(username, 'utf8').digest('hex');

    const newUserObj = {"_id": id, "username": username };

    console.log("New user: " + username + " and id: " + id);

    users.push(newUserObj);

    res.json(newUserObj);
    return;

  }
});

const findUserById = function(id) {

  for (var i=0; i<users.length; i++) {
    if (users[i]["_id"] == id) {
      return users[i];
    }
  }

  return null;

};

app.get('/api/users/exercises', (req, res) => {
    res.sendStatus(404);
});

app.post('/api/users/:_id/exercises', (req, res) => {

  const id = req.params["_id"];
  const description = req.body["description"];
  const durationStr = req.body["duration"];
  const duration = parseInt(durationStr);
  const dateStr = req.body["date"];
  
  // if empty -> 404 not found
  if (id == "") {
    res.sendStatus(404);
    console.log("New exercise failed: no id given\n");
    return;
  }

  const user = findUserById(id);
  
  if (user == null) {
    res.sendStatus(404);
    console.log("New exercise failed: couldn't find user\n");
    return;
  }

  const username = user["username"];

  if (description == "") {
    res.status(400).send("Path `description` is required.");
    console.log("New exercise failed: description is required\n");
    return;
  }

  if (durationStr == "") {
    res.status(400).send("Path `duration` is required.");
    console.log("New exercise failed: duration is required\n");
    return;
  }

  if (isNaN(duration)) {
    res.status(400).send("Path `duration` is not a number.");
    console.log("New exercise failed: duration is not a number\n");
    return;
  }

  let date = new Date(dateStr);

  if (dateStr == "" || dateStr == undefined) {
    date = new Date();
  }

  if (date == "Invalid Date") {
    res.status(400).send("Path `date` is not a valid date.");
    console.log("New exercise failed: date is not valid " + dateStr + "\n");
    return;
    
  }

  let exercise = JSON.parse(JSON.stringify(user));

  exercise["date"] = date.toDateString();
  exercise["duration"] = duration;
  exercise["description"] = description;


  console.log("New exercise for id: " + id);
  exercises.push(exercise);

  console.log(exercise);
  console.log("\n");

  res.json(exercise);
  return;

});

const findExercisesById = function(id, from, to, limit) {

  let findings = [];

  for (var i=0; i < exercises.length; i++) {

    if (exercises[i]["_id"] == id) {

      const dateStr = exercises[i]["date"];
      const date = new Date(dateStr);

      if (from != null) {
        if (date < from) {
          continue;
        }
      }

      if (to != null) {
        if (date > to) {
          continue;
        }
      }

      if (limit != null && findings.length >= limit) {
        break;
      }

      const finding = {
        "description": exercises[i]["description"],
        "duration": parseInt(exercises[i]["duration"]),
        "date": dateStr
      };

      // console.log(finding);

      findings.push(finding);
    }

  }

  return findings;

};

app.get('/api/users/:id/logs', (req, res) => {

  const id = req.params["id"];
  let logString = "Log request for: " + id + "/logs";
  let firstQuery = true;

  // handle from query
  const fromStr = req.query["from"];
  let from = null;

  if (fromStr != undefined) {
    from = new Date(fromStr);
    if (from == "Invalid Date") {
      res.status(400).send("Query `from` is not a valid date.");
      console.log("Log request failed: " + id + " from: " + fromStr);
      return;
    }

    if (firstQuery == true) {
      firstQuery = false;
      logString += "?";
    }

    logString += "from="+fromStr+"&";
  }

  // handle to query
  const toStr = req.query["to"];
  let to = null;

  if (toStr != undefined) {
    to = new Date(toStr);

    if (to == "Invalid Date") {
      res.status(400).send("Query `to` is not a valid date.");
      console.log("Log request failed: " + id + " to: " + toStr);
      return;
    }

    if (firstQuery == true) {
      firstQuery = false;
      logString += "?";
    }

    logString += "to="+toStr+"&";
  }

  // handle limit query
  const limitStr = req.query["limit"];
  let limit = null;

  if (limitStr != undefined) {
    limit = parseInt(limitStr);

    if (isNaN(limit)) {
      res.status(400).send("Query `limit` is not number.");
      console.log("Log request failed: " + id + " limit: " + limitStr);
      return;
    }

    if (firstQuery == true) {
      firstQuery = false;
      logString += "?";
    }

    logString += "limit="+limit+"&";
  }

  // remove last &
  logString = logString.substr(0, logString.length - 1);

  console.log(logString);

  // if empty -> 404 not found
  if (id == "") {
    res.sendStatus(404);
    return;
  }

  const user = findUserById(id);
  
  if (user == null) {
    res.sendStatus(404);
    return;
  }

  const findings = findExercisesById(id, from, to, limit);

  let logs = {
    "username": user["username"],
    "count": findings.length,
    "_id": id,
    "log": findings
  };

  res.json(logs);
  return;

});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
