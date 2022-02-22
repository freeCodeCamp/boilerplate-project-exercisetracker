const mongoose=require("mongoose");
const express=require("express");
const subSchema=require("./exercises");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true   
     },
     count:{
         type:Number,
         default:0
     },
     log:[{
        description:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,
            required:true,
        },
        date:{
            type:String,
            required:true,
        },
         _id:false
     }]
});
module.exports=new mongoose.model("User", userSchema);