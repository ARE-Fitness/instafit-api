require('dotenv').config();
const Gym=require('../models/gym');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const User=require('../models/user');
const sesClient = require('./send_email');
const shortid = require('shortid');
const AWS = require('aws-sdk');
const Branch=require('../models/branch');
const config = require('./config'); 
const s3=new AWS.S3({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret,
});

exports.getGymById=(req,res,next,id)=>{
     Gym.findById(id).exec((err,gym)=>{
         if(err){
          return res.status(400).json({
            error: "Error in DB"
          });
         }
         req.gym=gym;
         next();
     });
};
exports.getGym=(req,res)=>{
    res.json(req.gym);
};
exports.photoGym = (req, res, next) => {

      let params = {
        Bucket: "instafitfilesassets",
        Key: req.gym._id+"gym",
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
exports.authenticateGymProfile=(req,res)=>{
  let {key,value}=req.query;
  Gym.findOne({[key]:value},(err,gym)=>{
     if(err){
       return res.status(400).json({
         error:"Error in server"
       })
     }else{
        if(gym){
          res.json({
            msg:"Please try another "+key+" this "+key+" is already in use"
          });
        }else{
          res.json({
            msg:"account can be created with this "+key
          })
        }
     }
  })
}
exports.updateGym=(req,res)=>{
    
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  console.log('starting update')

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let gym = req.gym;
    
    if(fields.owner) fields.owner=JSON.parse(fields.owner);
    if(fields.gymManager) fields.gymManager=JSON.parse(fields.gymManager);

    gym = _.extend(gym, fields);


    if(file.photo){
      s3.putObject({
        Bucket: "instafitfilesassets",
        Key: gym._id+"gym",
        Body:fs.createReadStream(file.photo.path),
        ContentType:file.photo.type,
     },function(err,data){
       if(err){
         console.log('error in uploading image')
       }else{
         console.log('sucessfully updated images');
       }
     })
    }


    //save to the DB
    gym.save((err,gym) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of gym failed"
        });
      }
      User.findOneAndUpdate(
        {_id:gym.gymAdmin},
        {$set:{email:gym.email}},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"error on upading data"
                });
            }
          res.json(gym)
        }
    )
    });
  });

};
exports.createGym=(req,res)=>{
 
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }
      //destructure the fields
      const {  gymName,email,phone } = fields;
  
      if (!gymName || !email || !phone) {
        return res.status(400).json({
          error: "Please include"
        });
      }
  
      if(fields.owner) fields.owner=JSON.parse(fields.owner);
      if(fields.gymManager) fields.gymManager=JSON.parse(fields.gymManager);
      let  gym= new Gym(fields);
    

    

      let user = new User();
      user.role=1;
      user.email=email;
      let password=shortid.generate();//use for random unique password
      user.password="123456";
    
      user.save((err,user)=>{
        if(err){
          return res.status(400).json({
            error:"Error in db"
          });
        }
          gym.gymAdmin=user._id;

          gym.save((err,gym)=>{
            if(err){
              console.log(err)
              return res.status(400).json({
                error:"Error in db"
              });
            }
            user.pannelAccessId=gym._id;
            user.save((err,user)=>{
              if(err){
                return res.status(400).json({
                  error:"Error in server"
                })
              }

              if(file.photo){
                s3.putObject({
                  Bucket: "instafitfilesassets",
                  Key: gym._id+"gym",
                  Body:fs.createReadStream(file.photo.path),
                  ContentType:file.photo.type,
               },function(err,data){
                 if(err){
                   console.log('error in uploading in image')
                 }else{
                    console.log('successfully image uploaded')
                 }
               })
              }

              res.json(gym)
             
            })
          });
    });  
  });
};
exports.IsGymActive=(req,res,next)=>{
  if(req.gym.active==true){
    next();
  }else{
    return res.status(400).json({
      error:"Error in DB"
    })
  }
};
exports.getAllActiveGym=(req,res)=>{

  let {limit=8,page=1}=req.query;
  let gym= Gym.find({active:true},{gymName:1,phone:1,email:1,location:1,city:1,active:1}).sort({_id:-1}).skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit));
  gym.exec((err,gyms)=>{
    if(err){
      return res.status(400).json({
        error:"Error in Db"
      });
    }
   
    res.json(gyms)
  });

};
exports.getAllInActiveGym=(req,res)=>{

  let {limit=10,page=1}=req.query;

  let gym= Gym.find({active:false},{gymName:1,phone:1,email:1,location:1,city:1}).sort({_id:-1}).skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit));

  gym.exec((err,gyms)=>{
    if(err){
      return res.status(400).json({
        error:"Error in Db"
      })
    }
    res.json(gyms)
    
  });
};
exports.totalActiveGym=(req,res)=>{
      let {limit=9}=req.query;
      Gym.find({active:true}).exec((err,gyms)=>{
        if(err){
          return res.status(400).json({
            error:"Error in db"
          });
        }
      var x=gyms.length/parseInt(limit);
      res.json({total:gyms.length,page:Math.ceil(x)});
      });
};
exports.totalInActiveGym=(req,res)=>{
  let {limit=9}=req.query;
      Gym.find({active:false}).exec((err,gyms)=>{
        if(err){
          return res.status(400).json({
            error:"Error in db"
          });
        }
      var x=gyms.length/parseInt(limit);
      res.json({total:gyms.length,page:Math.ceil(x)});
  });
};
exports.blockOpGym=(req,res)=>{
   
  let {active}=req.body;
  let gym=req.gym;
  gym.active=active;
  gym.save((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in DB"
      });
    }
    res.json(gym);

  })

};
///TODO review and recure the code
exports.assignGymAdmin=(req,res)=>{
  let gym=req.gym;
  let user=new User(req.body);
  //checking a user is still registered or not and deleteing it.....
  if(req.gym.gymAdmin!=""){
    User.findOne({_id:gym.gymAdmin},(err,user)=>{
      user.remove();
    });
  }
  //assigning gym admin
  user.role=1;
  user.pannelAccessId=gym._id;
  gym.gymPass=user.password;
  user.save((err,user)=>{
    if(err){
      return res.status(400).json({
        error:"Error in db"
       });
    }
    gym.gymAdmin=user._id;
    gym.save((err,gym)=>{
      res.json({
        email:user.email,
        gympass:gym.gymPass
      })
    });
  });
};
exports.removeGymAdmin=(req,res)=>{
  if(req.gym.gymAdmin!=""){
    User.find({_id:req.gym.gymAdmin}).remove((err,user)=>{
      if(err){
        return res.status(400).json({
          error:"Error in DB"
        })
      }
      req.gym.gymAdmin="";
      req.gym.save((err,gym)=>{
        res.json(gym);
      });
     
    });
  }else{
    res.json({
      msg:"No admin is assigned"
    })
  }

};
////////////-----///////////
exports.addExtypeToGym=(req,res)=>{
  let gym=req.gym;
  let {exType}=req.body;
  gym.extypeList.push(exType);
  gym.save((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in Db"
      });
    }
    res.json(gym);
  });
};
exports.popExtypeFromGym=(req,res)=>{
  let gym=req.gym;
  let {item}=req.body;
  var index=gym.extypeList.indexOf(item);
  if(index>-1){
    gym.extypeList.splice(index,1);
  }
  gym.save((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in Db"
      });
    }
    res.json(gym);
  });
};
exports.addTgmsclToGym=(req,res)=>{
  let gym=req.gym;
  let {targetMscl}=req.body;
  gym.tgmsclList.push(targetMscl);
  gym.save((err,gym)=>{
    if(err){
     return res.status(400).json({
       error:"Error in Db"
     });
    }
    res.json(gym);
  });
};
exports.popTgmsclFromGym=(req,res)=>{
  let gym=req.gym;
  let {item}=req.body;
  var index=gym.tgmsclList.indexOf(item);
  if(index>-1){
    gym.tgmsclList.splice(index,1);
  }
  gym.save((err,gym)=>{
    if(err){
     return res.status(400).json({
       error:"Error in Db"
     });
    }
    res.json(gym);
  });
};
exports.addExlableToGym=(req,res)=>{
  let gym=req.gym;
  let {exLable}=req.body;
  gym.exlevelList.push(exLable);
  gym.save((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in Db"
      });
    }
    res.json(gym);
  });
};
exports.popExlableFromGym=(req,res)=>{
  let gym=req.gym;
  let {item}=req.body;
  var index=gym.exlevelList.indexOf(item);
  if(index>-1){
    gym.exlevelList.splice(index,1);
  }
  gym.save((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in Db"
      });
    }                 
    res.json(gym);
  });
};
exports.searchGyms=(req,res)=>{
  const {data}=req.body;
  Gym.find({gymName:data}).exec((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in db"
      });
    }
    res.json(gym)
  });
};//search

exports.gettotalList=(req,res)=>{
  let gym=req.gym;
  let totalprocess=0;
  let members=0;
  if(gym.branchList.length!=0){
    Branch.find({_id:gym.branchList}).exec((err,branchs)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        });
      }
      branchs.forEach(branch=>{
        totalprocess++;
        members=members+branch.memberList.length;
        if(totalprocess==branchs.length){
          res.json({
            totalmembers:members,
            totalbranch:gym.branchList.length
          })
        }
      })
    })
  }else{
    res.json({
      totalmembers:0,
      totalbranch:gym.branchList.length
    })
  }
};

//check gym exist in the server or not
exports.checkGymStatus=(req,res)=>{

  let {field,value}=req.query;
  //console.log(field,value)

  Gym.findOne({
    [field]:value
  }).exec((err,gym)=>{
    if(err){
      return res.status(400).json({
        error:"Error in db"
      })
    }
    if(gym){
      res.json({
        message:"gym already exist",
        found:true
      })
    }
    if(!gym){
      res.json({
        message:"no gym found",
        found:false
      })
    }
  })
  

}