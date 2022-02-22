const mongoose=require("mongoose");
const express=require("express");
const subSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        _id:false
    },
    duration:{
        type:Number,
        required:true,
        _id:false
    },
    date:{
        type:String,
        required:true,
        _id:false
    },
    _id:false
});

module.exports=subSchema;