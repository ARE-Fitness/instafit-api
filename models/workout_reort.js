const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

// {//exercise list of the day
//     ex_set_name:{type:String},
//     unit:{type:String},
//     value:{type:String},
//     rep:{type:Number},
//     set:{type:Number},
// }

var workoutReportSchema=new mongoose.Schema({ 
    ex_day_display_name:{
        type:String
    },
    ex_day:{
        type:String,
    },
    date:{
        type:String,
    },
    exerciseslist: {
        type:Array,
        default:[]
    },
    exercise_remark:{
        type:String,
        default:""
    },
    contents:[{
        type:ObjectId,
        ref:"Content"
    }],
    member:{
        type:ObjectId,
        ref:"Member"
    }
});

module.exports=mongoose.model("WorkoutReport",workoutReportSchema);