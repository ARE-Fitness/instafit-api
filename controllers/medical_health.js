const MedicalHealth = require('../models/medical_health');

exports.getMedicalHealthById=(req,res,next,id)=>{
    MedicalHealth.findById(id).exec((err,medical_health)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }else{
            req.medical_health=medical_health;
            next();
        }
    });
}

exports.getMedicalHealth=(req,res)=>{
    console.log(req.medical_health)
    res.json(req.medical_health)
}

exports.updateMedicalHealth=(req,res)=>{
    let medical_health=req.medical_health;
    MedicalHealth.findOneAndUpdate(
        {_id:medical_health._id},
        {$set:req.body},
        {new:true,useFindAndModify:true},
        (err,medical_health)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            
            res.json(medical_health);
        }
    )
}