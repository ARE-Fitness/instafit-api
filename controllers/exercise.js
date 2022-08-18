const { deleteMany } = require("../models/exercise");
const Exercise=require("../models/exercise");


exports.getExerciseById=(req,res,next,id)=>{
    Exercise.findById(id).exec((err,exercise)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }

        req.exercise=exercise;
        next();

    })
};
exports.getExercise=(req,res)=>{
    res.json(req.exercise);
};
exports.getAllExercises=(req,res)=>{
    Exercise.find({_id:req.planner.exdays}).exec((err,exercises)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(exercises)
    })
};
exports.addExercise=(req,res)=>{
    let exercise=new Exercise(req.body);
    let planner=req.planner;
    exercise.save((err,exercise)=>{
        if(err){
             return res.status(400).json({
                 error:"Error in db"
             });
        }
        planner.exdays.push(exercise._id);
        planner.save((err,planner)=>{
          if(err){
                return res.status(400).json({
                    error:"Error in db"
                });
          }
          res.json(exercise);
        });
    });
};
exports.removeExercise=(req,res)=>{
    let exercise=req.exercise;
    let planner=req.planner;
    exercise.remove((err,exercise)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        var index=planner.days[exercise.day].exercises.indexOf(exercise._id);
        if(index>-1){
            planner.days[exercise.day].exercises.splice(index,1); 
        }
        planner.save();
        res.json({msg:"successful"})
    });
};
exports.updateExercise=(req,res)=>{
    Exercise.findOneAndUpdate(
        {_id:req.exercise._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},(err,exercise)=>{
            if(err){
                return res.status(400).json({
                erro:"Error in db"
                })
            }
            res.json({msg:"succesfully updated"})
        }
    )
};


exports.getAllSelectedexercises=(req,res)=>{
    let {exercisesId}=req.body;
    Exercise.find({_id:exercisesId}).exec((err,exercises)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json(exercises);
    })
}

exports.deleteAllSelectedExercise= (req,res)=>{
    let {exercisesId}=req.body;
    let planner=req.planner;

    console.log('started',exercisesId)


    exercisesId.forEach(id => {
        let index=planner.exdays.indexOf(id);
        if(index>-1){
        planner.exdays.splice(index,1);
        }
    });

    planner.save().then(()=>{
        Exercise.deleteMany({_id:exercisesId}).then(()=>{
            console.log('updated planner')
            res.json({msg:"successfully deleted"});
        });
    }).catch(()=>{
        return res.status(400).json({
            error:"Error in db"
        })
    })

   
}