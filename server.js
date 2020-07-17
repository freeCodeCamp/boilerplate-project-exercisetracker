const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const shortId = require('shortid');
//Connecting Database
process.env.MONGO_URI='mongodb+srv://tanmay0808:%23tanmay%401999@cluster0-g4jxm.mongodb.net/cluster0?retryWrites=true&w=majority';
const mongoose = require('mongoose')
try{
  mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
}
catch(err)
{
  console.log(error);
}

//Creating A Mongo Schema
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  shortId:{type:String,unique:true,default:shortId.generate()},
  username : String,
  exerciseArray:[{
    description:String,
    duration:Number,
    dateCreated:{}
  }]
});

const ExerciseData = mongoose.model('ExerciseData',ExerciseSchema);

app.use(cors());

//Mounting BodyParser To Handle Post Parameters
app.use(bodyParser.urlencoded({extended: false}));

//Serving static assets i.e style.css
app.use(express.static('public'));

//Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route('/api/exercise/new-user').post(function(req,res){
  var name = req.body.name;

  ExerciseData.findOne({username:name},(err,data)=>{
    if (!err)
    {
      if (data === null)
      {
        var newUser = new ExerciseData({
          username:name,
          exerciseArray:[]
        });
        newUser.save((err,data)=>{
          if (!err)
          {
            res.json({"username":data.username,shortId:data.shortId,"_id":data._id});
          }
          else{
            res.json({"error":"Something Went Wrong"});
            console.log(err);
          }
        });
      }
      else{
        res.json({"error":"Username Already Taken"});
      }
    }
    else{
      res.json({"error":"Error Creating User"});
      console.log(err);
    }
  });
});


//Adding Exercise To dB
app.route('/api/exercise/add').post(function(req,res){
  var userid = req.body.userid;
  
  var date = req.body.date !== "" ? new Date(req.body.date) : '';
  
  var activityToAdd = {
    description:req.body.description,
    duration:req.body.duration,
    dateCreated:date
  };
  
  //Searching For Data In dB
  ExerciseData.findOne({shortId:userid},(err,data)=>{
    if (!err)
    {
      if (data === null)
      {
        res.json({"error":"Invalid UserId"});
      }
      else{

        if (data.exerciseArray.length === 0) {
          data.exerciseArray = data.exerciseArray.concat([activityToAdd]);
        }else if (data.exerciseArray.dateCreated == null){
            data.exerciseArray.splice(0,0,activityToAdd);
        }else{
          let mark = 'pending';
          for (let i = 0; i<data.exerciseArray.length; i++){
            if (activityToAdd.dateCreated < data.exerciseArray[i].dateCreated){
              data.exercise.splice(i,0,activity);
              mark = 'done'
              break;
            }
          }
          if (mark === 'pending'){
           data.exerciseArray = data.exerciseArray.concat(activityToAdd); 
          }
        }
        data.save((err,data)=>{
          if (!err)
          {
            res.json({"username":data.username,"description":activityToAdd.description,"duration":activityToAdd.duration,"_id":data._id,"date":activityToAdd.dateCreated,shortId:data.shortId});
          }
          else{
            console.log(err);
            res.json({"error":"Error Adding Exercise, Try Again"})
          }
        })
      }
    }
    else{
      res.json({"error":"Something Went Wrong While Searching In dB"});
    }
  });
});


//Getting All Users
app.route('/api/exercise/users').get((req,res)=>{
  ExerciseData.find({},(err,data)=>{
    if (!err)
    {
      data = data.map(d=>{
        return {username:d.username,"_id":d._id,"__v":d.__v,shortId:d.shortId};
      });
      res.send(data);
    }
    else{
      res.json({error:"Something Went Wrong"});
    }
  });
});

function isValidDate(d){
  return d instanceof Date && !isNaN(d);
}

//Exercise Logs
app.route('/api/exercise/log').get((req,res)=>{
  var userId = req.query.userId;
  var fromDate = new Date(req.query.from);
  var toDate = new Date(req.query.to);
  var limit = Number(req.query.limit);
  
  ExerciseData.findOne({shortId:userId},(err,data)=>{
    if (!err)
    {
      if (data === null)
      {
        res.json({"error":"Invalid UserId"});
      }
      else{
        var results = data.exerciseArray;

        if (isValidDate(toDate))
        {
          results = results.filter((item)=>(item.dateCreated >= fromDate && item.dateCreated <= toDate));
        }
        else if (isValidDate(fromDate))
        {
          results = results.filter((item)=>item.dateCreated >= fromDate);
        }

        //Apply Limit to result
        if (!isNaN(limit) && results.length > limit)
        {
          results = results.slice(0,limit);
        }

        res.json({"_id":data._id,username:data.username,count:results.length,logs:results,shortId:data.shortId});
      }
    }
    else{
      res.json({"error":"Error Fetching Logs"});
    }
  });
});


const listener = app.listen(process.env.PORT || 3002, (err) => {
  console.log('Your app is listening on port' + listener.address().port);
});
