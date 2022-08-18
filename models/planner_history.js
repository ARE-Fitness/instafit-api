const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

var planner_historySchema=new mongoose.Schema({
    planner_startDate:{
        type:String,
    },
    planner_name:{
        type:String,
        default:""
    },
    exdays:[{
        type:ObjectId,
        ref:"Exercise"
    }],
    member:{
        type:ObjectId,
        ref:"Member"
    }
});

module.exports = mongoose.model("PlannerHistory",planner_historySchema);