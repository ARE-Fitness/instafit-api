const Member =require("../models/member");
const Branch=require("../models/branch");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Calender=require("../models/calender");
const MedicalReport=require("../models/medical_report");
const AWS = require('aws-sdk');
const config = require('./config'); 
const MedicalHealth=require('../models/medical_health');
const s3=new AWS.S3({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret,
})
const XLSX=require('xlsx');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6d990d2d1af24a8fb9c64b1924b6782e.mailgun.org';
const mg = mailgun({apiKey: process.env.Mailgun_API_Key, domain: DOMAIN});


//member controllers
exports.getMemberById=(req,res,next,id)=>{
    Member.findById(id).exec((err,member)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        req.member=member;
        next();
    })
};
exports.getMember=(req,res)=>{
    res.json(req.member);
};
exports.createMember=(req,res)=>{

let form = new formidable.IncomingForm();
form.keepExtensions = true;
form.parse(req, (err, fields, file) => {
  if (err) {
    return res.status(400).json({
      error: "problem with image"
    });
  }
  //destructure the fields
  const {  mfname,mlname,memail,mphone} = fields;

  

  if (!mfname||!mlname || !memail || !mphone) {
    return res.status(400).json({
      error: "Please include"
    });
  }

  let  member= new Member(fields);
  
 // var jsonReport=JSON.parse(medicalReports);
 // member.medical_report_list=jsonReport;

  let calender=new Calender();
  calender.save((err,calender)=>{
    member.calender=calender._id;
    member.branchId=req.branch._id;
    let medical_health=new MedicalHealth();
    medical_health.save((err,medical_health)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        })
      }
      member.medicalHealth=medical_health._id;
      member.save((err,member)=>{
        if(err){
          return  res.status(400).json({
            error: "Saving question  DB failed"
          });
        }
        medical_health.member=member._id;
        medical_health.save();
        let data = {
          from: 'noreplay@instafitindia.com',
          to: member.memail,
          subject: `Instafit India`,
          html:`
              <h6>Welcome to instafit india.</h6>
          `
          };
          mg.messages().send(data, function (error, body) {
              if(error){
                  console.log("Error something went wrong please try again")
              }else{
                  console.log("Email is sent")
              }
          });
        
        //assigning member to branch
        if(file.mphoto){
          s3.putObject({
            Bucket: "instafitfilesassets",
            Key: member._id+"member",
            Body:fs.createReadStream(file.mphoto.path),
            ContentType:file.mphoto.type,
           },function(err,data){
              if(err){
               
                  console.log("failed to fetch image")
               
              }else{
                  console.log("Successfully ")
              }
          })
        }
        req.branch.memberList.push(member._id);
        req.branch.save((err,branch)=>{
                 if(err){
                   return res.status(400).json({
                     error:"Error in db"
                   })
                 }
                 res.json(member);
           
            }); 
        });

    })
  
  }); 
});
};
exports.updateMember=(req,res)=>{

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let member = req.member;
    member = _.extend(member, fields);
     
    if(fields.medicalReports){
      let {medicalReports}=fields;
      var jsonReport=JSON.parse(medicalReports);
      member.medical_report_list=jsonReport;
    }

    if(file.mphoto){
      s3.putObject({
        Bucket: "instafitfilesassets",
        Key: member._id+"member",
        Body:fs.createReadStream(file.mphoto.path),
        ContentType:file.mphoto.type,
       },function(err,data){
              if(err){
                console.log('unable to update image')
              }else{
                console.log('successfully updated')
              }
       })
    }

    //save to the DB
    member.save((err, member) => {
      if (err) {
       return  res.status(4000).json({
          error: "Updation of question failed"
        });
      }
      res.json(member);
     
    });
  });

};
exports.getMemberPhoto=(req,res,next)=>{
    let params = {
        Bucket: "instafitfilesassets",
        Key: req.member._id+"member",
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
};
exports.getAllActiveMembersByBranch=(req,res)=>{
    let {limit=8,page=1}=req.query;
    Member.find({_id:req.branch.memberList,active:true})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,members)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json(members)
    })
};
exports.getAllInActiveMembersByBranch=(req,res)=>{
  let {limit=8,page=1}=req.query;
  Member.find({_id:req.branch.memberList,active:false})
  .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
  .exec((err,members)=>{
      if(err){
          return res.status(400).json({
              error:"Error in db"
          });
      }
      res.json(members)
  })
};
exports.OPblockMember=(req,res)=>{
  let {active}=req.body;
  let member=req.member;
  member.active=active;
  member.save((err,member)=>{
    if(err){
      return res.status(400).json({
        error:"Error in DB"
      });
    }
    res.json(member);
  });
};
exports.totalPageActiveMember=(req,res)=>{
  let {limit=8}=req.query;
  Member.find({_id:req.branch.memberList,active:true},{_id:1}).exec((err,members)=>{
    if(err){
      return res.status(400).json({
        error:"Error in db"
      });
    }
     
  res.json({
    page:Math.ceil(members.length/parseInt(limit)),
    total:members.length
  });
  })
};
exports.totalPageInActiveMember=(req,res)=>{
  let {limit=8}=req.query;
  Member.find({_id:req.branch.memberList,active:false},{_id:1}).exec((err,members)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        });
      }
      res.json({
        page:Math.ceil(members.length/parseInt(limit)),
        total:members.length
      });
  });
};
exports.getAllMembersOfGymBranchs=(req,res)=>{
  let gym=req.gym;
  let {active}=req.body;//retrive members depending on the active [true/false] value
  let members=[];
  let totalprocess=0;

  Branch.find({_id:gym.branchList}).exec((err,branchs)=>{
    if(err){
      return res.status(400).json({
        error:"Error in db"
      });
    }
    branchs.forEach(branch=>{
      totalprocess++;
      branch.memberList.forEach(id=>{
        members.push(id);
      })
      if(totalprocess==branchs.length){
        Member.find({_id:members,active:active}).exec((err,memberlist)=>{
          if(err){
            return res.status(400).json({
              error:"Error in db"
            })
          }
          res.json(memberlist)
        })
      }
    })
  })
  
}

//check member exist in the server or not
exports.checkMemberStatus=(req,res)=>{

  let {field,value}=req.query;

  Member.findOne({
    [field]:value
  }).exec((err,member)=>{
    if(err){
      return res.status(400).json({
        error:"Error in db"
      })
    }
    if(member){
      res.json({
        message:"member already exist",
        found:true
      })
    }
    if(!member){
      res.json({
        message:"no member found",
        found:false
      })
    }
  })
  

}


exports.bulkMemberUpload=(req,res)=>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    
    var workbook = XLSX.readFile(file.bulkmember.path, {
      type: 'binary'
    });
    var memberlist=[];
    workbook.SheetNames.forEach(function(sheetName) {
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      var json_object = JSON.stringify(XL_row_object);
      memberlist.push(JSON.parse(json_object));
    })

    let datafields=["mfname","mlname","memail","mphone"];
    let extensions=['xls','xlsb','xlsm','xlsx'];
    let nameattr=file.excel.name.split('.');
    let extensionExist=Boolean(extensions.find(ex=>ex==nameattr[nameattr.length-1]));
    let counterIndex=0;
    for(let key in memberlist[0][0]){
      if(key==datafields[counterIndex]){
        counterIndex++;
      }
    }


    if(counterIndex==4&&extensionExist){
        Member.insertMany(memberlist[0]).then(()=>{
            res.json("created successfully")
        }).catch(()=>{
            return res.status(400).json({
              error:"Error in db"
            })
        });
    }else{
      res.json("Something went wrong please try again")
    }
    



  })
}


exports.getAllMember=(req,res)=>{
  let sortedData={};
  for(let key in req.query){
     if(key){
         if(key=="_id"){
             let arrayIdData=req.query[key].split("-");
             sortedData[key]=arrayIdData;
         }else{
             sortedData[key]=req.query[key]
         }
     }
  }

 Member.find(sortedData).exec((err,members)=>{
     if(err){
         return res.status(400).json({
             error:"Error in db"
         })
     }else{
        
         res.json(members)
     }
 })
}