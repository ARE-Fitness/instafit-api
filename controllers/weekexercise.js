const Day=require("../models/day");
const Exercise=require("../models/exercise");
const Planner=require("../models/planner");

exports.getDayById=(req,res,next,id)=>{
    Day.findById(id).exec((err,day)=>{

        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }

        req.day=day;
        next();
    });
}

exports.getDay=(req,res)=>{
    res.json(req.day);
}


exports.getDayExercises=(req,res)=>{
    Exercise.find({_id:req.day.exercises}).exec((err,exercises)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(exercises);
    });
}

exports.getAllDaysWithExercise=(req,res)=>{
    var data=[];
    Day.find({_id:req.planner.days}).exec((err,days)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        days.forEach(element => {

            Exercise.find({_id:element.exercises}).exec((err,exercises)=>{

                if(err){
                    return res.status(400).json({
                        error:"Error in db"
                    });
                }

                data.push(
                    {
                        day:day,
                        exercises:exercises
                    }
                )

            })
            
        });
        res.json(data);
    });
}
