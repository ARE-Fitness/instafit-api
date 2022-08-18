const User=require("../models/user");

exports.getUserById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err){
            return res.status(400).json({
                error: "Error in DB"
            });
        }
        req.user=user;
        next();
    });
};

exports.getUser=(req,res)=>{
    res.json(req.user);
};

exports.getSelectedUser=(req,res)=>{
    const {ID}=req.body;
    User.findOne({_id:ID}).exec((err,user)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        res.json(user);
        
    })
};


exports.updateUser=(req,res)=>{
    const {password,email,newemail}=req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(401).json({
            err: "User not found in DB"
            });
        }
        if(!user.autheticate(password)){
            return res.status(401).json({
             err:"Password not matched"
            });
        }
        
        User.findOneAndUpdate(
            {_id:user._id},
            {$set:{email:newemail}},
            {new:true,useFindAndModify:false},
            (err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"error on upading data"
                    });
                }
                res.json(user)
            }
        )
       

    })
}