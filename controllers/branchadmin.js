const Branch = require("../models/branch");
const BranchAdmin=require("../models/branchadmin");
const User=require("../models/user");
const config=require('./config');
const fs=require('fs');
const _ = require("lodash");
const formidable = require("formidable");
const AWS=require('aws-sdk');
const s3=new AWS.S3({
    accessKeyId:config.aws.key,
    secretAccessKey:config.aws.secret
});
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6d990d2d1af24a8fb9c64b1924b6782e.mailgun.org';
const mg = mailgun({apiKey: process.env.Mailgun_API_Key, domain: DOMAIN});

exports.getBranchAdminById=(req,res,next,id)=>{
    BranchAdmin.findById(id).exec((err,branchadmin)=>{
 
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }

        req.branchadmin=branchadmin;
        next();

    })
}

exports.getBranchAdmin=(req,res)=>{
    res.json(req.branchadmin);
}

exports.photoBranchAdmin=(req,res,next)=>{
    let params = {
        Bucket: "instafitfilesassets",
        Key: req.branchadmin._id+"branchadmin",
    };
    s3.getObject(params, function(err, data) {
        if (err){
            return res.status(400).json({
                error:"Error in  fetching photo"
            })
        }
        console.log(data.Body)
        if(data.Body){
            res.send(data.Body);
            next();
        }
    }); 
}

exports.getAllActiveBranchAdmin=(req,res)=>{
    let {limit=8,page=1}=req.query;
    BranchAdmin.find({_id:req.branch.branchAdminList,active:true}).
    skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,branchadmins)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(branchadmins);
    })
}

exports.getAllInActiveBranchAdmin=(req,res)=>{
    let {limit=8,page=1}=req.query;
    BranchAdmin.find({_id:req.branch.branchAdminList,active:false})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,branchadmins)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(branchadmins);
    })
}


exports.totalactiveBranchAdminPage=(req,res)=>{
    let {limit=8}=req.query;
    BranchAdmin.find({_id:req.branch.branchAdminList,active:true}).exec((err,branchadminlist)=>{
        if(err){
            return res.status(400).json({
                error:"Errorn in db"
            })
        }
        res.json({
            total:branchadminlist.length,
            page:Math.ceil(branchadminlist.length/parseInt(limit))
        })
    })
};


exports.totalinactiveBranchAdminPage=(req,res)=>{
    let {limit=8}=req.query;
    BranchAdmin.find({_id:req.branch.branchAdminList,active:false}).exec((err,branchadminlist)=>{
        if(err){
            return res.status(400).json({
                error:"Errorn in db"
            })
        }
        res.json({
            total:branchadminlist.length,
            page:Math.ceil(branchadminlist.length/parseInt(limit))
        })
    })
};



exports.OPbranchAdminBlock=(req,res)=>{
    let {active}=req.body;
    console.log(active);
    let branchadmin=req.branchadmin;
    branchadmin.active=active;
    branchadmin.save((err,branchadmin)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            })
        }
        res.json(branchadmin);
    });
}
exports.assignBranchAdmin=(req,res)=>{
   let user=new User();
   let branch=req.branch;
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req, (err, fields, file) => {
     if (err) {
       return res.status(400).json({
         error: "Error in server"
       });
     }

     let {bfname,blname,bemail,bphone}=fields;
     if(bfname==""||blname==""||bemail==""||bphone==""){
         return res.status(400).json({
             error:"fields should not be empty"
         });
     }
     fields.specialization=JSON.parse(fields.specialization);
     let branchadmin=new BranchAdmin(fields);
     branchadmin.branchId=branch._id;
     branchadmin.save((err,branchadmin)=>{
         if(err){
             return res.status(400).json({
                 error:"Error in db"
             });
         }
         let data = {
        from: 'noreplay@instafitindia.com',
        to:bemail,
        subject: `Instafit india`,
        html:`
            <h6>Welcome to instafit india</h6>
        `
        };
        mg.messages().send(data, function (error, body) {
            if(error){
                console.log("Error something went wrong please try again")
            }else{
                console.log("Email is sent")
            }
        });
         user.email=branchadmin.bemail;
         user.password="123456";
         user.role=branchadmin.role;
         user.pannelAccessId=branchadmin._id;
         user.save((err,user)=>{
            if(err){
                 return res.status(400).json({
                     error:"Error in db"
                 })
            }
            branchadmin.userId=user._id;
            branchadmin.save((err,branchadmin)=>{
                if(err){
                    return res.status(400).json({
                        error:"error in db"
                    });
                }
                    branch.branchAdminList.push(branchadmin._id);
                    branch.save((err,branch)=>{
                        if(err){
                            return res.status(400).json({
                                error:"error in db"
                            });
                        }
                        s3.putObject({
                            Bucket: "instafitfilesassets",
                            Key: branchadmin._id+"branchadmin",
                            Body:fs.createReadStream(file.bphoto.path),
                            ContentType:file.bphoto.type,
                        },function(err,data){
                            if(err){
                            }else{
                                res.json(branchadmin);
                            }
                        })
                    })
            })
         })
     })

    });

};
exports.updateBranchAdmin=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
  
    
      //updation code
      let branchadmin = req.branchadmin;
      let arry=JSON.parse(fields.specialization);
      console.log(arry)
      fields.specialization=arry;
      branchadmin = _.extend(branchadmin, fields);

    
    
  
  
      //save to the DB
      branchadmin.save((err,branchadmin) => {
        if (err) {
          return res.status(400).json({
            error: "Updation of gym failed"
          });
        }
        if(file.bphoto){
            s3.putObject({
                Bucket: "instafitfilesassets",
                Key: branchadmin._id+"branchadmin",
                Body:fs.createReadStream(file.bphoto.path),
                ContentType:file.bphoto.type,
              },function(err,data){
               if(err){
                   console.log(err);
               }else{
                 console.log("sucessfully uploaded")
               }
              })
        }
        console.log('duksi')
        console.log(branchadmin.userId);
        console.log(branchadmin.bemail);

        User.findOneAndUpdate(
            {_id:branchadmin.userId},
            {$set:{email:branchadmin.bemail}},
            {new:true,useFindAndModify:false},
            (err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"error on upading data"
                    });
                }
                console.log('duksi')
                res.json(branchadmin);
            }
        )
        
      
      });
     });  
};



//check BranchAdmin exist in the server or not
exports.checkBranchAdminStatus=(req,res)=>{

    let {field,value}=req.query;
    let branch=req.branch;
    if(branch.branchAdminList){
        BranchAdmin.findOne({
            [field]:value,
            _id:branch.branchAdminList
          }).exec((err,branchadmin)=>{
            if(err){
              return res.status(400).json({
                error:"Error in db"
              })
            }
            if(branchadmin){
              res.json({
                message:"branch already exist",
                found:true
              })
            }
            if(!branchadmin){
              res.json({
                message:"no branch found",
                found:false
              })
            }
          })
    }else{
        res.json('ok')
   }
    
    
  
}




exports.getAllBranchAdminUsers=(req,res)=>{
  
    let {active=true}=req.query;
    BranchAdmin.find({active}).exec((err,branchadmins)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }else{
            // console.log(branchadmins)
            res.json(branchadmins)
        }
    })
}
