const branch = require("../models/branch");
const Branch=require("../models/branch");
const BranchAdmin=require("../models/branchadmin");
const Gym=require("../models/gym");
const User=require('../models/user');


exports.getBranchById=(req,res,next,id)=>{
     Branch.findById(id).exec((err,branch)=>{
         if(err){
             return res.status(400).json({
                 error:"Error in DB"
             })
         }
         req.branch=branch;
         next();
     })
};
exports.getBranch=(req,res)=>{
    
    res.json(req.branch);

};
exports.createBranch=(req,res)=>{
    let branch=new Branch(req.body);
    let user=new User();
    let gym=req.gym;
    branch.gymId=gym._id;
    branch.gymName = gym.gymName;
    branch.save((err,branch)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            })
        } 
        gym.branchList.push(branch._id);
        gym.save((err,gym)=>{
           if(err){
                return res.status(400).json({
                    error:"Error in db"
                });
           }
           user.email=branch.branchmanager.email;
           user.pannelAccessId=branch._id;
           user.role=3;
           user.password="123456";
           user.save((err,user)=>{
               if(err){
                   return res.status(400).json({
                       error:"Error in db"
                   });
               }
               branch.branchmanager.user=user._id;
               branch.save(()=>{
                res.json(branch);
               });
            });

        });
       
    })
};
exports.updateBranch=(req,res)=>{
    Branch.findOneAndUpdate(
        {_id: req.branch._id},
        {$set:req.body},
        {new: true, useFindAndModify: false},
        (err,branch)=>{

            if(err){
                return res.status(400).json({
                    error: "Error to connect with branch  DB"
                });
            }
            User.findOneAndUpdate(
                {_id:branch.branchmanager.user},
                {$set:{email:branch.branchmanager.email}},
                {new:true,useFindAndModify:false},
                (err,user)=>{
                    if(err){
                        return res.status(400).json({
                            error:"error on upading data"
                        });
                    }
                    res.json(branch);
                }
            )
        }
    );
};
exports.getAllActiveBranch=(req, res)=>{
let {limit=8,page=1}=req.query;
Branch.find({_id:req.gym.branchList,active:true}).skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit)).exec((err,branchs)=>{
    if(err){
        return res.status(400).json({
            error:"Error in DB"
        });
    }
    res.json(branchs)
});
};
exports.getAllInActiveBranch=(req,res)=>{
    let {limit=8,page=1}=req.query;
    Branch.find({_id:req.gym.branchList,active:false}).skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit)).exec((err,branchs)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            })
        }
        res.json(branchs);
    });
};
exports.blockOPBranch=(req,res)=>{
    let {active}=req.body;
    let branch=req.branch;
    branch.active=active;
    branch.save((err,branch)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(branch);
    });
};
exports.totalActiveBranchs=(req,res)=>{
    let {limit=8}=req.query;
    Branch.find({_id:req.gym.branchList,active:true}).exec((err,branchs)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        //console.log(branch.length);
        res.json({
            total:branchs.length,
            page:Math.ceil(branchs.length/parseInt(limit))
        });
    })     
};
exports.totalInActiveBranchs=(req,res)=>{
    let {limit=8}=req.query;
    Branch.find({_id:req.gym.branchList,active:false}).exec((err,branchs)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json({
            total:branchs.length,
            page:Math.ceil(branchs.length/parseInt(limit))
        });
    })     
};
exports.getAllActivebranchAdmin=(req,res) => {
 
    let {limit=10,page=1}=req.body;
    BranchAdmin.find({_id:req.branch.branchAdminList,active:true})
    .skip((parseInt(page)-1)*limit).limit(limit).pretty()
    .exec((err,branchAdminList)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(branchAdminList)
    })
};
exports.getBranchByUser=(req,res)=>{
    
    let {limit=10,page=1}=req.body;
    BranchAdmin.findOne({_id:req.user.pannelAccessId})
    .skip((parseInt(page)-1)*limit).limit(limit).pretty()
    .exec((err,branchadmin)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }

        Branch.findOne({_id:branchadmin.branchId}).exec((err,branch)=>{
            res.json(branch);
        })

    })
};

//check Branch exist in the server or not
exports.checkBranchStatus=(req,res)=>{

    let {field,value}=req.query;
    let gym=req.gym;
  
    Branch.findOne({
      _id:gym.branchList,
      [field]:value
    }).exec((err,branch)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        })
      }
      if(branch){
        res.json({
          message:"branch already exist",
          found:true
        })
      }
      if(!branch){
        res.json({
          message:"no branch found",
          found:false
        })
      }
    })
    
  
}

exports.getAllBranch=(req,res)=>{
  
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
    Branch.find(sortedData).exec((err,branchs)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }else{
            res.json(branchs)
        }
    })
}


