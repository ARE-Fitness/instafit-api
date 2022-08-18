const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;
const Exercise=require("../models/exercise");


var plannerSchema=new mongoose.Schema({
    planner_name:{
        type:String
    },
    level:{
       type:String // planner level
    },
    created_by:{
        type:String
    },
    planner_freq:{//set week frequency
        type:Number,
        default:7
    },
    ex_frequency:{//exercise frequency is used to add content limit in a day
        type:Array,
        default:[0,0,0,0,0,0,0]
    },
    off_days:[{//off_days is used to store off days in a planner (not importent for now) 
        type:String
    }],
    days_display_names:{
        type:Array,
        default:["Untitled Exercise 1","Untitled Exercise 2","Untitled Exercise 3","Untitled Exercise 4","Untitled Exercise 5","Untitled Exercise 6","Untitled Exercise 7"]
    },
    wormup:{
       type:ObjectId,
       ref:"Content"
    },
    exdays:[{
        type:ObjectId,
        ref:"Exercise"
    }],
    cooldown:{
        type:ObjectId,
        ref:"Content"
    },
    active:{//active and inactive operaion
        type:Boolean,
        default:true
    },
    account_id:{
        type:String
    },
    account_role:{
        type:0 //0 -instafit  admin, 1- gym admin, 2- branch admin  
    },
    access_role:{
        type:0 // 0- private 1-internal access  2- public
    }
});

module.exports=mongoose.model("Planner",plannerSchema);