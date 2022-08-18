const Appoientment=require('../models/appoientment');
const Member= require(`../models/member`);
const Branch= require("../models/branch");
const Notification = require("../models/notification");
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6d990d2d1af24a8fb9c64b1924b6782e.mailgun.org';
const mg = mailgun({apiKey: process.env.Mailgun_API_Key, domain: DOMAIN});

exports.getAppoientmentById=(req,res,next,id)=>{
    Appoientment.findById(id).exec((err,appoientment)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        req.appoientment=appoientment;
        next();
    });
}

exports.getAppoientment=(req,res)=>{
    res.json(req.appoientment)
}

exports.createAppoientment=(req,res)=>{
     let appoientment=req.body;
     let member=req.member;
     appoientment.member=member._id;
     appoientment.save((err,appoientment)=>{
         if(err){
             return res.status(400).json({
                 error:"Error on crearting the data"
             })
         }
         member.appoientmentList.push(appoientment._id);
         res.json(appoientment)
     });
}




exports.updateAppoientment=(req,res)=>{
    let {actionLog,parentId}=req.body;
    Appoientment.findOneAndUpdate(
            {_id:req.appoientment._id},
            {$set:req.body},
            {new: true, useFindAndModify: false},
            (err,appoientment)=>{
                if(err){
                   return res.status(400).json({
                        error:"Error in db"
                    })
                }
                let notification=new Notification();
                notification.title="Appoientment alert";
                notification.actionLog="appoientment";
                if(actionLog=="appoientment_start"){
                   notification.description="The appoientment is set by "+member.mfname+" "+member.mlname+".";
                }else{
                   notification.description="The planner and your test has been updated by branch admin.";
                }
                notification.save((err,notification)=>{
                    if(err) console.log("error in db")
                    else{
                       
                        if(actionLog=="appoientment_start"){
                            Branch.findOne({
                                _id:parentId
                            }).exec((err,branch)=>{
                                if(err) console.log('error in server')
                                else{
                                    let data = {
                                    from: 'noreplay@instafitindia.com',
                                    to:branch.branchmanager.email,
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
                                    branch.notification_list.push(notification._id);
                                    branch.save((err,branch)=>{
                                        if(err) console.log('error  in db')
                                        else console.log('notification saved succesfully');
                                    });
                                    let currentdate=new Date.now();
                                    let date=new Date(currentdate);
                                    date.setDate(date.getDate()+7);
                                    let job=schedule.scheduleJob(date, function(){
                                        job.cancel();
                                        notification.remove((err,notification)=>{
                                            if(err){
                                                console.log("error in db")
                                            }else{
            
                                                let indexbranch=branch.notification_list.indexOf(notification._id);
                                                if(indexbranch>-1){
                                                    branch.notification_list.splice(indexbranch,1);
                                                }
                                                branch.save((err,branch)=>{
                                                    if(err) console.log("error in deleting notification")
                                                    else console.log("successfully deleted")
                                                })
                                                   
                                            
                                            }
                                        })
                                    });
                    

                                }
                            })
                        }else{
                            member.findOne({
                                _id:parentId
                            }).exec((err,member)=>{
                                if(err) console.log('error in server')
                                else{
                                    let data = {
                                        from: 'noreplay@instafitindia.com',
                                        to:member.memail,
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
                                    member.notification_list.push(notification._id);
                                    member.save((err,branch)=>{
                                        if(err) console.log('error  in db')
                                        else console.log('notification saved succesfully');
                                    });

                                    let currentdate=new Date.now();
                                    let date=new Date(currentdate);
                                    date.setDate(date.getDate()+7);
                                    let job=schedule.scheduleJob(date, function(){
                                        job.cancel();
                                        notification.remove((err,notification)=>{
                                            if(err){
                                                console.log("error in db")
                                            }else{
            
                                                    let indexmember=member.notification_list.indexOf(notification._id);
                                                    if(indexmember>-1){
                                                        member.notification_list.splice(indexmember,1)
                                                    }
                                                    member.save((err,member)=>{
                                                        if(err) console.log("unable to save the data");
                                                        else console.log("sucessfully notification created")
                                                    });
                                            
                                            }
                                        })
                                    });
                    

                                }
                            })
                        }
                    }
                })
                res.json(appoientment);
            }
        
    )
}




exports.getAllAppoientment=(req,res)=>{
    let branch=req.branch;
    let appoientments=[]
    if(branch.memberList.length!=0){
        let counter=0;
        branch.memberLis.forEach(id => {
            Member.findById(id).exec((err,member)=>{
                if(err){
                    return res.status(400).json({
                        err:"Error in db"
                    })
                }
                if(member.appoientmentList.length!=0){
                    let array= member.appoientmentList;
                    appoientments=[...appoientments,...array];
                }
            });
            counter++;
            if(counter==branch.memberList.length){
                Appoientment.find({
                    _id:appoientments
                }).exec((err,lists)=>{
                    if(err){
                        res.status(400).json({
                            error:"Error in db"
                        });
                    }
                    res.json(lists)
                })
            }
        });
    }else{
        res.json({
            msg:"nothing to show"
        })
    }

}

exports.getAllAppoientmentByMember=(req,res)=>{
    let {limit=8,page=1}=req.query;
    Appoientment.find({_id:req.member.appoientmentList}).skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit)).exec((err,appoientments)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }
        res.json(appoientments)
    });
}