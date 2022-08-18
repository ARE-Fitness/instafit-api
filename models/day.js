const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var  daySchema=new mongoose.Schema({
    exday:{
        type:String
    },
    week_day:{
        type:String
    },
    display_ex_name:{
        type:String
    },
    date:{
        type:String
    },
    exercises:[{
        type:ObjectId,
        ref:"Exercise"
    }]
});

module.exports=mongoose.model("Day",daySchema);