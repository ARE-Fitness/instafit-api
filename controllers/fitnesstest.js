const FitnessTest=require("../models/fitnesstest");

exports.getMemberFitnessTestById=(req,res,next,id)=>{
    FitnessTest.findById(id).exec((err,fitnesstest)=>{
        if(err){
            return res.status(400).json({
                error:"Error on db"
            })
        }
        req.fitnesstest=fitnesstest;
        next()
    })
};

exports.getMemberFitnessTest=(req,res)=>{
    res.json(req.fitnesstest);
}

exports.getAllMemberFitnessTest=(req,res)=>{
    let {limit=9,page=1}=req.query;
    FitnessTest.find({_id:req.member.fitnessTest})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,fitnesstest)=>{
       if(err){
           return res.status(400).json({
               error:"Error in Db"
           });
       } 
       res.json(fitnesstest);
    });
}

exports.takeFitnessTestForMember=(req,res)=>{
    let fitnesstest=new FitnessTest(req.body);
    fitnesstest.member=req.member._id;
    fitnesstest.save((err,fitnesstest)=>{
        if(err){
            return res.status(400).json(
                {error:"Err in db"}
            )
        }
        req.member.fitnessTest.push(fitnesstest._id);
        req.member.save();
        res.json(fitnesstest)
    });
}


exports.updateFitnessTest=(req,res)=>{
    FitnessTest.findOneAndUpdate(
        {_id:req.fitnesstest._id},
        {$set:req.body},
        {new: true, useFindAndModify: false},
        (err,fitnesstest)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                });
            }
            res.json(fitnesstest);
        });
}

exports.removeFitnessTest=(req,res)=>{
    FitnessTest.remove({_id:req.fitnesstest._id},(err,fitnesstest)=>{
       if(err){
           return res.status(400).json({
               error:"Error to delete the doc"
           });
       }
       var index=req.member.fitnessTest.indexOf(req.fitnesstest._id);
       if(index>-1){
           req.member.fitnessTest.splice(index,1);
       }
       req.member.save();
       res.json(fitnesstest);
   });
};

exports.totalPageMemberFitnessTest=(req,res)=>{
    let {limit=8}=req.query;
    FitnessTest.find({_id:req.member.fitnessTest},{_id:1}).exec((err,fitnesstests)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        });
      }
    res.json({
      page:Math.ceil(fitnesstests.length/limit),
      total:fitnesstests.length
    });
    });
  };

























































































































































































































































































































