//TODO:exercise report routes
const { DataExchange } = require('aws-sdk');
const WorkoutReport=require('../models/workout_reort');

exports.getWorkOutReportById=(req,res,next,id)=>{
    WorkoutReport.findById(id).exec((err,workout_reort)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        req.workout_reort=workout_reort;
        next();
    });
}

exports.getWorkoutReport=(req,res)=>{
    res.json(req.workout_reort);
}

exports.addWorkoutReport=(req,res)=>{
    let workout_reort=new WorkoutReport(req.body);
    let member=req.member;
    workout_reort.save((err,workout_reort)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        member.workout_reports_list.push(workout_reort._id);
        member.save((err,member)=>{
            if(err){
                return res.status(400).json({
                    error:"error in db"
                });
            }
            res.json(workout_reort);
        });
    })
};


exports.getAllMemberWorkOutReports=(req,res)=>{
    let {limit,page}=req.query;
    WorkoutReport.find({_id:req.member.workout_reports_list})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,workout_reports_list)=>{
        if(err){
            return res.status(400).json({
                error:"Errorin db"
            })
        }
        res.json(workout_reports_list);
    })
};

exports.getSelectedWorkoutReport=(req,res)=>{
    let {dates}=req.body;
    let member=req.member;
    WorkoutReport.find({_id:member.workout_reports_list,date:dates}).exec((err,reports)=>{
          if(err){
              return res.status(400).json({
                  error:"error in db"
              })
          }else{
              res.json(reports)
          }
    })
}

exports.updateMemberWorkOutRerport=(req,res)=>{
    WorkoutReport.findOneAndUpdate(
        {_id:req.workout_reort._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,workout_reort)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(workout_reort);
        }
    );
};


exports.totalWorkOutReportPagesnDocsOfMember=(req,res)=>{
    let {limit=9}=req.query;
    let member=req.member;
    WorkoutReport.find({_id:member.workout_reports_list}).exec((err,reports)=>{
        if(err){
          return res.status(400).json({
           error:"Error in db"
          });
        }
        var x=reports.length/parseInt(limit);
        res.json({total:reports.length,page:Math.ceil(x)});
    });
}


exports.findWorkOutReport=(req,res)=>{
    let {date}=req.body;
    let member=req.member;
    WorkoutReport.find({_id:member.workout_reports_list}).exec((err,reports)=>{
        if(err){
           return res.status(400).json({
               error:"Error in db"
           })
        }else{
            console.log(date)
            let found=reports.find(doc=>doc.date==date);
            console.log(found)
            if(Boolean(found)){
                 res.json(found)
            }else{
                return res.status(400).json({
                    error:"not found"
                })
            }
          
        }
    });
}


exports.sortReportsByDate=(req,res)=>{
    let datelist=req.body;
    let member=req.member;

    WorkoutReport.find({_id:member.phybodycomp_list,date:datelist}).exec((err,workout_reports)=>{
        if(err){
             return res.status(400).json({
                 error:"Error in db"
             })
        }

        res.json(workout_reports)
    })
}