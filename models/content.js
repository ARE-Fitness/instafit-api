const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema;


var contetSchema=new mongoose.Schema({
    exMode:{  //0-Warm Up 1-Main Exercise 2-Cool Down //3-fitness content
        type:Number,
        default:2
    },
    exName:{
        type:String
    },
    Instructions:{
        type:String
    },
    exercise_Steps:{
        type:Array,
        default:[]
    },
    exType:{
        type:String
    },
    primary_muscle:{
        type:ObjectId,
        ref:'Parameter'
    },
    secondary_muscle:[{
        type:ObjectId,
        ref:'Parameter'
    }],
    exLevels:[{
        type:ObjectId,
        ref:"Parameter"
    }],
    fileupload:{
        type:Boolean,
        default:true
    },
    videoList:{
        type:Array,
        default:[]
    },
    audioList:{
        type:Array,
        default:[]
    },
    gymId:{
        type:ObjectId,
        ref:"Gym"
    },
    gymName:{
        type:String,
        default:""
    },
    active:{
        type:Boolean,
        default:true
    }
});

module.exports=mongoose.model("Content",contetSchema);