const DailyExerciseEvent=require("../models/daily_ex_event");

exports.getDailyExerciseEventById=(req,res,next,id)=>{
    DailyExerciseEvent.findById(id).exec((err,dailyexerciseevent)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        req.dailyexerciseevent=dailyexerciseevent;
    });
};

exports.getDailyExerciseEvent=(req,res)=>{
    res.json(req.dailyexerciseevent);
};
