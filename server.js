const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
const User = require("./models/users");
const Exercise = require("./models/exercises")
const bodyParser = require("body-parser");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("DB Connected Successfully");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(express.static('public'))



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//POST USERNAME AND GET ID

app.post('/api/users', async (req, res) => {
  try {
    var NewUser = await new User({ username: req.body.username });
    const savedUser = await NewUser.save((err) => {
      if (err) {
        console.log(err);
        res.send("error")
      }
      console.log("user saved success");
    });
    //let dispData=await User.find({_id:NewUser._id},{username:1,_id:1});
    res.status(200).json({
      username: NewUser.username,
      _id: NewUser._id
    });
  }
  catch (e) {
    res.status(500).json(e);
  }
});

//POST ID AND EXERCISE DETAILS AND GET DATA AND CONSOLE DATA

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    if (req.body.date == " " || req.body.date == undefined) {
      var date = new Date().toDateString();
    }
    else {
      var date = new Date(req.body.date).toDateString();
    }
    var exerciseData = {
      description: req.body.description,
      duration: req.body.duration,
      date: date
    }
    const userData = await User.findOneAndUpdate({ _id: req.params._id }, { $push: { logs: exerciseData }, $inc: { count: 1 } }, { new: true });

    console.log(userData);
    res.status(200).json({

      username: userData.username,
      description: req.body.description,
      duration: req.body.duration,
      date: new Date(date).toDateString(),
      _id: userData._id
    });
  }
  catch (e) {
    console.log(e);
  }
})

app.get("/api/users", async (req, res) => {
  try {
    const allUser = await User.find({}, { username: 1, _id: 1 });
    res.json(allUser);
  }
  catch (e) {
    res.json("Error");
  }
});





app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const userData = await User.find({ _id: req.params._id }, { __v: 0 });
      console.log("log without query", userData[0]);
      res.json(userData[0]);
    }
    else {
      console.log("else part entered")
      var from = req.query.from;
      var to = req.query.to;
      var limit = req.query.limit;
      console.log(from, to, limit);
      if (from) {
        var from = new Date(req.query.from).toISOString().split('T')[0];
        console.log("from", from);
        if (!to) {
          var to = new Date().toISOString().split('T')[0];
          console.log(to);
        }
        else {
          var to = new Date(req.query.to).toISOString().split('T')[0];
        }
      }

      var userData = await User.find({ _id: req.params._id }, { __v: 0 });

      console.log(userData, "<------THIS IS USER DATA");
      var logsArray = userData[0].log;
      console.log("this is array of log OG", logsArray);
      console.log(from, to);
      if (from || (from && to)) {
        var filtLogs = logsArray.filter((log) => {
          var formdate = new Date(log.date).toISOString().split('T')[0];
          return ((from && formdate >= from) && (to && formdate <= to))
        })
      } else {
        var filtLogs = logsArray;
      }
      console.log("this is filtered logs--->", filtLogs);

      const slicedLogs = limit ? filtLogs.slice(0, limit) : filtLogs;
      
      console.log("SLICED OUTPUT WITH LIMIT", slicedLogs);
      return res.json({
        _id: req.params._id,
        username: userData.username,
        count: slicedLogs.length,
        log: slicedLogs
      });
    }
  } catch (e) { res.json(e) }
});

//app.get("/api/users/:_id/logs",async(req,res)=>{
//   try
//   {
//      const userData= await User.findById(req.params._id);
//      var from=new Date(req.query.from).toISOString().split('T')[0];
//      var to=new Date(req.query.to).toISOString().split('T')[0];
//      var limit=req.query.limit;
//      console.log(from,to,limit);
//          if(from||to||limit)
//         {
//          console.log(userData);
//          var logsArray=userData.logs;
//          console.log(logsArray);
//          const filtLogs=logsArray.filter((log)=>
//           {
//           var formdate=new Date(log.date).toISOString().split('T')[0];
//           return (from&&formdate>=from) && (to&&formdate<=to)
//           });

//          console.log("Thsi is filter logs",filtLogs);
//          const slicedLogs=limit?filtLogs.slice(0,limit):filtLogs;
//          console.log("This is Sliced Logs",slicedLogs);
//          //userData.logs=slicedLogs 
//          res.json(slicedLogs);
//         }
//       else
//       {
//       console.log(userData);
//       res.json(userData);
//       }
//   }
// catch(e)
// {
//   res.send(e);
//       }
// });

// app.get("/api/users/:_id/logs",async(req,res)=>{
//   try{
//   // console.log(req.params._id);
//  const userData=await User.find({_id:req.params._id},{__v:0});
//   res.json(userData[0]);
// }
// catch(e){
//   res.send("error");
// }
// });




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
