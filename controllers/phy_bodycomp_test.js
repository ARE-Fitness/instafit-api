const PhyBodyCompTest=require("../models/phy_bodycomp_test");

exports.getMemberPhyBodyCompTestById=(req,res,next,id)=>{
    PhyBodyCompTest.findById(id).exec((err,phybodycomptest)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });        
        }
       req.phybodycomptest=phybodycomptest;
       next();
    })
}


exports.getMemberPhyBodyCompTest=(req,res)=>{
  res.json(req.phybodycomptest);
}

exports.getAllMemberPhyBodyComp=(req,res)=>{
    let {limit=9,page=1}=req.query;
    PhyBodyCompTest.find({_id:req.member.phybodycomptest})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,phybodycomptest)=>{
        if(err){
            return res.status(400).json({
                error:"ERROR IN DB"
            })
        }
        res.json(phybodycomptest)
    })
}

exports.takePhyBodyCompTestForMember=(req,res)=>{
    let phybodycomptest=new PhyBodyCompTest(req.body);
    phybodycomptest.member=req.member._id;
    phybodycomptest.save((err,phybodycomptest)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            })
        }
        req.member.phybodycomp_list.push(phybodycomptest._id);
        req.member.save();
        res.json(phybodycomptest);
    })
}

exports.updatePhyBodyCompTest=(req,res)=>{
    PhyBodyCompTest.findOneAndUpdate(
        {_id:req.phybodycomptest._id},
        {$set:req.body},
        {new: true, useFindAndModify: false},
        (err,phybodycomptest)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                });
            }
            res.json(phybodycomptest);
    });
}

exports.removePhyBodyCompTest=(req,res)=>{
    PhyBodyCompTest.remove({_id:req.phybodycomptest._id},(err,phybodycomp)=>{
       if(err){
           return res.status(400).json({
               error:"Error to delete the doc"
           });
       }
       var index=req.member.phybodycomp_list.indexOf(req.phybodycomptest._id);
       if(index>-1){
           req.member. phybodycomp_list.splice(index,1);
       }
       req.member.save();
       res.json(phybodycomptest);
   });
}

exports.totalPageMemberPhyBodyCompTest=(req,res)=>{
    let {limit=8}=req.query;
    PhyBodyCompTest.find({_id:req.member. phybodycomp_list},{_id:1}).exec((err,phybodycomptests)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        });
      }

    res.json({
      page:Math.ceil(phybodycomptests.length/limit),
      total:phybodycomptest.length
    });
    });
  };