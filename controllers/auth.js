require('dotenv').config();
const User=require("../models/user");
var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6d990d2d1af24a8fb9c64b1924b6782e.mailgun.org';
const mg = mailgun({apiKey: process.env.Mailgun_API_Key, domain: DOMAIN});


//signup user
exports.SignUp=(req,res)=>{
   let {email,password,role}=req.body;
   User.findOne({email}).exec((err,us)=>{
      if(err){
          return res.status(400).json({
              error:"Error connecting with db please try again"
          })
      }
      if(us){
        return res.status(400).json({
            error:"email already exist try another email"
        })
      }
      let token=jwt.sign({email,password,role},process.env.Jwt_Account_Activation,{expiresIn:'20m'});
      let data = {
        from: 'noreplay@instafitindia.com',
        to: email,
        subject: 'Account Varification',
        html:`
          <h2>Please click on the link to activate the account</h2>
          <h4>User Credential</h4>
          <h3>User ID: ${email}</h3>
          <h3>password: ${password}</h3>
          <a href="http://localhost:5000/api/account-activation?token=${token}">http://localhost:5000/account/activation/${token}</a>
        `
      };
      mg.messages().send(data, function (error, body) {
           if(error){
               return res.json({error:"Error something went wrong please try again"})
           }

           res.json({message:"Email is sent, Kindly please activate the account"})
      });
  
   })

};

exports.accountActivation=(req,res)=>{
    let {token}=req.query;

    if(token){
        jwt.verify(token,process.env.Jwt_Account_Activation,function(err,decodedToken){
            if(err){
                return res.status(400).json({
                    error:"token doesnot exist"
                })
            }else{
              let {email,password,role}=decodedToken;
              User.findOne({email}).exec((err,us)=>{
                if(err){
                    return res.status(400).json({
                        error:"Error connecting with db please try again"
                    })
                }
                if(us){
                    return res.status(400).json({
                        error:"email already exist try another email"
                    })
                }
                let user=new User({email,password,role,isVarified:true});
                user.save((err,user)=>{
                    if(err){
                    return res.status(400).json({
                        error:"Error in creating user"
                    });
                    }
                    res.redirect(`http://test.${process.env.Client_URL}`)
                });
              });
            }
         
        })
    }else{
        return res.status(400).json({
            error:"Something went wrong"
        })
    }
}

exports.SignIn=(req,res)=>{
     const {email,password}=req.body;
     

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

         


         const token=jwt.sign({ _id: user._id },process.env.SECRET);
         res.cookie("token",token,{ expire: new Date() + 9999 });
         const {_id,email,role,pannelAccessId,isVarified}=user;
         return res.json({
             token,
             user:{_id,email,role,pannelAccessId,isVarified,account_log:isVarified?"Varified Account":"Account is not Varified"}
         });

        
     });
     
}

exports.SignOut=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"Master user signout Sucessfully"
    });
    
      
};

//auth email
exports.authenticateEmail=(req,res)=>{
    let {email}=req.query;
    User.findOne({email}).exec((err,user)=>{
        if(err){
            return res.status(400).json({
                errormsg:"something went wrong please try after sometime"
            });
        }else{
            if(user){
                res.json({
                     msg:"Email Exist"
                })
            }else{
                return res.status(401).json({
                    error:"Email does not exist"
                });
            }
        }
    })
}

//protected routes
exports.isSignedIn=expressjwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//custom middleware

exports.isAuthenticated=(req,res,next)=>{
    let checker= req.user && req.auth && req.user._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACESS DENIED"
        });
    }
    next();
}

exports.isAdmin=(req,res,next)=>{
    if(req.user.role===0){
        next();
    }else{
   
    return res.status(400).json({ 
        error:"Access Denied" 
    });
       
    }
};


exports.isInstaFitGymAdmin=(req,res,next)=>{
  if(req.user.role===0||req.user.role===1){
      next();
  }else{
 
  return res.status(400).json({ 
      error:"Access Denied" 
  });
     
  }
};


exports.isInstaFitGymBranchAdmin=(req,res,next)=>{
  if(req.user.role===0||req.user.role===1||req.user.role===2){
      next();
  }else{
 
  return res.status(400).json({ 
      error:"Access Denied" 
  });
     
  }
};