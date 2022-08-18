const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

var calenderSchema=new mongoose.Schema({
    events:[{       
        type:ObjectId,
        ref:"DailyExerciseEvent"
    }]
});

module.exports=mongoose.model("Calender",calenderSchema);
