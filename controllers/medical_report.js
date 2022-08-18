const MedicalReport=require("../models/medical_report");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const AWS=require('aws-sdk');
const config = require('./config'); 
const s3=new AWS.S3({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret,
})



exports.getMedicalReportById=(req,res,id,next)=>{
      MedicalReport.findById(id).exec((err,medical_report)=>{
          if(err){
              return res.status(400).json({
                  error:"Error in db"
              });
          }
          req.medical_report=medical_report;
          next();

      })
};


exports.getMedicalReport=(req,res)=>{
    res.json(req.medical_report);
};


exports.getMedicalReportFile=(req,res,next)=>{
    if (req.medical_report.reportData.data) {
        res.set("Content-Type", req.medical_report.reportData.contentType);
        return res.send(req.medical_report.reportData.data);
      }
      next();
}


exports.addMedicalReport=(req,res)=>{
    let member=req.member;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //destructure the fields
      const {  eportName } = fields;
  
      if (!eportName) {
        return res.status(400).json({
          error: "Please include"
        });
      }
  
      let  medical_report= new MedicalReport(fields);
      let filepath=file.docfle.path;

      medical_report.save((err,medical_report)=>{
        if(err){
            return res.status(400).json({
                error:"error in db"
            });
        }
        member.medical_report_list.push(medical_report._id);
        member.save((err,member)=>{
          if(err){
            return res.status(400).json({
              error:"Error in db"
            })
          }
          if(medical_report.isfileupload){
            s3.putObject({
              Bucket: "instafitfiles",
              Key: medical_report._id+"medicalreport",
              Body:fs.createReadStream(filepath),
              ContentType:file.docfle.type,
             },function(err,data){
                if(err){
                  return  res.status(400).json({
                    error: "failed to fetch"
                  });
                }else{
                  res.json(medical_report);
                }
            })
          }else{
            res.json(medical_report);
          }
        });
      });  
    });

}

exports.updateMedicalReport=(req,res)=>{
      
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with file"
      });
    }

    //updation code
    let medical_report = req.medical_report;
    medical_report = _.extend(medical_report, fields);
    let filepath=file.docfle.path;

    //save to the DB
    medical_report.save((err,medical_report) => {
      if (err) {
        res.status(4000).json({
          error: "Updation of gym failed"
        });
      }
      if(medical_report.isfileupload){
        s3.putObject({
          Bucket: "instafitfiles",
          Key: medical_report._id+"medicalreport",
          Body:fs.createReadStream(filepath),
          ContentType:file.docfle.type,
         },function(err,data){
            if(err){
              return  res.status(400).json({
                error: "failed to fetch"
              });
            }else{
              res.json({
                msg:"update successfully"
              });
            }
        })
      }else{
        res.json({
          msg:"update successfully"
        });
      }
    });
  });
};


exports.getAllMedicalReport=(req,res)=>{
    let {limit=10,page=1}=req.body;
    let member=req.member;
    MedicalReport.find({_id:member.medical_report_list}).skip((parseInt(page)-1)*limit).limit(limit).pretty().exec((err,medical_reports)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json(medical_reports);
    })
}