const Measurement=require('../models/measurement');

exports.getMemberMeasureMentById=(req,res,next,id)=>{
    Measurement.findById(id).exec((err,measurement)=>{
        if(err){
            return res.status(400).json({
                error:"error in db"
            })
        }
        req.measurement=measurement;
        next();
    })
}

exports.getMemberMeasurement=(req,res)=>{
res.json(req.measurement);
}

exports.getAllMemberMeasurememt=(req,res)=>{
 let {limit=9,page=1}=req.query;
 Measurement.find({_id:req.member.measurement_list})
 .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
 .exec((err,measurements)=>{
     if(err){
         return res.status(400).json({
             error:"Error in DB"
         })
     }
     res.json(measurements)
 })
}

exports.takeMeasureMentForMember=(req,res)=>{
     let measurement=new Measurement(req.body);
     measurement.member=req.member._id;
     measurement.save((err,measurement)=>{
         if(err){
             return res.status(400).json({
                 error:"err in Db"
             })
         }
         req.member.measurement_list.push(measurement._id);
         req.member.save();
         res.json(measurement);
     })
};


exports.updateMeasurerment=(req,res)=>{
    Measurement.findOneAndUpdate(
        {_id:req.measurement._id},
        {$set:req.body},
        {new: true, useFindAndModify: false},
        (err,measurement)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                });
            }
            res.json(measurement);
        });
}

exports.removeMeasurement=(req,res)=>{
    Measurement.remove({_id:req.measurement._id},(err,measurement)=>{
       if(err){
           return res.status(400).json({
               error:"Error to delete the doc"
           });
       }
       var index=req.member.measurement_list.indexOf(req.measurement._id);
       if(index>-1){
           req.member.measurement_list.splice(index,1);
       }
       req.member.save();
       res.json(measurement);
   });
}

exports.totalPageMemberMeasurement=(req,res)=>{
    let {limit=8}=req.query;
    Measurement.find({_id:req.member.measurement_list},{_id:1}).exec((err,measurements)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        });
      }

    res.json({
      page:Math.ceil(measurements.length/limit),
      total:measurements.length
    });
    });
  };