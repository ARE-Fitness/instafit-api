const Test=require("../models/test");

exports.getTestById=(req,res,next,id)=>{
    Test.findById(id).exec((err,test)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        req.test=test;
        next();        
    });
};
exports.getTest=(req,res)=>{
    res.json(req.test);
};
exports.getAllMeasurementTestByGym=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Test.find({_id:req.gym.testList,test_type:0})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,tests)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(tests);
    });
};
exports.getAllMeasurementTestByBranch=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Test.find({_id:req.branch.testList,test_type:0})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,tests)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(tests);
    });
};
exports.getAllFitnessTestByGym=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Test.find({_id:req.gym.testList,test_type:1})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,tests)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(tests);
    })
};
exports.getAllFitnessTestByBranch=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Test.find({_id:req.branch.testList,test_type:1})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,tests)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(tests);
    });
};
exports.AddTestToGym=(req,res)=>{
    let test=new Test(req.body);
    test.save((err,test)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        req.gym.testList.push(test._id);
        req.gym.save();
        res.json(test);
    });
};
exports.AddTestToBranch=(req,res)=>{
    let test=new Test(req.body);
    test.save((err,test)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }

        req.branch.testList.push(test._id);
        req.branch.save();
        res.json(test);
    });
};
exports.removeTestFromGym=(req,res)=>{
    let test=req.test;
    test.remove((err,test)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        var index=req.gym.testList.indexOf(test._id);
        if(index>-1){
            req.gym.testList.splice(index,1);
        }
        req.gym.save();
        res.json(test);
    })
};
exports.removeTestFromBranch=(req,res)=>{
    let test=req.test;
    test.remove((err,test)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        var index=req.branch.testList.indexOf(test._id);
        if(index>-1){
            req.branch.testList.splice(index,1);
        }
        req.branch.save();
        res.json(test);
    })
};
exports.totalGymPageTest=(req,res)=>{
    let {limit=9,testtype=0}=req.query;
    Test.find({_id:req.gym.testList,test_type:testtype},{_id:1}).exec((err,tests)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json({
            total:tests.length,
            page:Math.ceil(tests.length/parseInt(limit))
        });
    })
};
exports.totalBranchPageTest=(req,res)=>{
    let {limit=9,testtype=0}=req.query;
    Test.find({_id:req.branch.testList,test_type:testtype},{_id:1}).exec((err,tests)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json({
            total:tests.length,
            page:Math.ceil(tests.length/parseInt(limit))
        });
    })
};