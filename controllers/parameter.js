require('dotenv').config();
const Parameter = require("../models/parameter");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const AWS = require('aws-sdk');
const config = require('./config'); 
const s3=new AWS.S3({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
});



exports.getParameterById=(req,res,next,id)=>{
    Parameter.findById(id).exec((err,parameter)=>{
        if(err){
            return res.status(404).json({
                error:"Error to find paramter"
            })
        }

        req.parameter=parameter;
        next();
    });
}




exports.addParameter=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            });
        }

        const { name } = fields;

        if(!name && name == ""){
            return res.status(400).json({
                error: "please include all the fields"
            });
        }

        let parameter = new Parameter(fields);

        parameter.save((err, parameter )=> {
            if(err){
                return res.status(400).json({
                  error:"Error in Db"
                });
            }
             if(file.photo){
                s3.putObject({
                    Bucket: "instafitfilesassets",
                    Key: parameter._id+"parameter",
                    Body:fs.createReadStream(file.photo.path),
                    ContentType:file.photo.type,
                 },function(err,data){
                   if(err){
                      console.log("err uploading the image")
                   }else{
                      parameter.isPhotoUploaded=true;
                      parameter.save();
                   }
                 }) 
             }
             res.json(parameter);
        });
         
    })
}

exports.updateParameter=(req,res)=>{
      
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }


    //updation code
    let parameter = req.parameter;  
    parameter = _.extend(parameter, fields);

      //save to the DB
      parameter.save((err,parameter) => {
        if (err) {
          return res.status(400).json({
            error: "Updation of parameter failed"
          });
        }
       
          if(file.photo){
            s3.putObject({
                Bucket: "instafitfilesassets",
                Key: parameter._id+"parameter",
                Body:fs.createReadStream(file.photo.path),
                ContentType:file.photo.type,
            },function(err,data){
                if(err){
                    console.log("err in upload")
                }else{
                    console.log('successfully image uploaded')
                }
            })
          }
     
            res.json(parameter);

      
      });

  })

}




exports.getParameter=(req,res)=>{
    res.json(req.parameter);
}


exports.getPhotoParameter=(req,res)=>{
    let params = {
        Bucket: "instafitfilesassets",
        Key: req.parameter._id+"parameter"
    };
    s3.getObject(params, function(err, data) {
        if (err){
            return res.status(400).json({
                error:"Error in  fetching data"
            })
        }
        if(data.Body){
            res.send(data.Body);
            next();
        }
    }); 
}

exports.getAllParameters=(req,res)=>{
    let {type}=req.query;
    let sortData={};
    if(type) sortData["type"]=type;

    Parameter.find(sortData).exec((err,parameters)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(parameters);
    });
}


exports.deleteParameter=(req,res)=>{
    let parameter=req.parameter;
    let params = {
        Bucket: "instafitfilesassets",
        Key: req.parameter._id+"parameter"
    };
    
    s3.deleteObject(params,function(err,data){
        if(err){
            console.log('unable to delete')
        }else{
          console.log('deleted')
        }
    })
    parameter.remove((err,parameter)=>{
        if(err){
           return res.status(400).json({
               error:"Error  in db"
           })        
        }else{
            res.json(parameter);
        }
    })
  
}