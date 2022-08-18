const Lecture_Alter=require("../models/lecture_alter");

exports.getLectureAlterById=(req,res,next,id)=>{
      Lecture_Alter.findById(id).exec((err,lecture_alter)=>{
          if(err){
              return res.status(400).json({
                  error:"Error in Db"
              })
          }
          req.lecture_alter=lecture_alter;
          next();
      })
}



exports.getLectureAlterById=(req,res)=>{
    res.json(req.lecture_alter);
}