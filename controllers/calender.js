const Calender=require("../models/calender");
const DailyExerciseEvent=require("../models/daily_ex_event");

exports.getCalenderById=(req,res,next,id)=>{
    Calender.findById(id).exec((err,calender)=>{
        if(err){
            return res.status(400).json({
                error:"Er in db"
            });
        }
        req.calender=calender;
        next();
    });
};

exports.getCalender=(req,res)=>{
    res.json(req.calender);
};

exports.getAllDailyExerciseEventsByCalender=(req,res)=>{
    DailyExerciseEvent.find({_id:req.calender.events}).exec((err,events)=>{
        if(err){
            return res.status(400).json({
                error:"error in db"
            });
        }
        res.json(events);
    });
};