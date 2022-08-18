const Notification=require('../models/notification');
const schedule=require('node-schedule');

exports.getNotificationById=(req,res,id,next)=>{
    Notification.findById(id).exec((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        req.notification=notification;
        next();
    });
}

exports.getNotification=(req,res)=>{
    res.json(req.notification);
}

exports.createBranchNotification=(req,res)=>{
    let notification=new Notification(req.body);
    let branch=req.branch;

    notification.save((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let currentdate=new Date.now();
        let date=new Date(currentdate);
        date.setDate(date.getDate()+7);
        let job=schedule.scheduleJob(date, function(){
            job.cancel();
            notification.remove((err,notification)=>{
                if(err){
                    console.log("error in db")
                 }else{
                    let index=branch.notification_list.indexOf(notification._id);
                    if(index>-1){
                        branch.notification_list.splice(index,1);
                    }
                    branch.save((err,branch)=>{
                        if(err) console.log("error in deleting notification")
                        else console.log("successfully deleted")
                    })
                }
            })
        });
        branch.notification_list.push(notification._id);
        branch.save((err,branch)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        });
    })
};


exports.removeBranchNotification=(req,res)=>{
    let notification=req.notification;
    let branch=req.branch;

    notification.remove((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let index=branch.notification_list.indexOf(notification._id);
        if(index>-1){
            branch.notification_list.splice(index,1);
        }
        branch.save((err,branch)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        })
    })
}

exports.updateNotification=(req,res)=>{
    let notification=req.notification;

    Notification.findOneAndUpdate(
        {_id:notification._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,notification)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        }
    );

}

exports.getAllBranchNotificationByBranch=(req,res)=>{
    let branch=req.branch;
    Notification.find({_id:branch.notification_list}).exec((err,notifications)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(notifications);
    })
}







exports.createGymNotification=(req,res)=>{
    let notification=new Notification(req.body);
    let gym=req.gym;

    notification.save((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let currentdate=new Date.now();
        let date=new Date(currentdate);
        date.setDate(date.getDate()+7);
        let job=schedule.scheduleJob(date, function(){
            job.cancel();
            notification.remove((err,notification)=>{
                if(err){
                    console.log("error in db")
                 }else{
                    let index=gym.notification_list.indexOf(notification._id);
                    if(index>-1){
                        gym.notification_list.splice(index,1);
                    }
                    gym.save((err,gym)=>{
                        if(err) console.log("error in deleting notification")
                        else console.log("successfully deleted")
                    })
                }
            })
        });
        gym.notification_list.push(notification._id);
        gym.save((err,gym)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        });
    })
};


exports.removeGymNotification=(req,res)=>{
    let notification=req.notification;
    let gym=req.gym;

    notification.remove((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let index=gym.notification_list.indexOf(notification._id);
        if(index>-1){
            gym.notification_list.splice(index,1);
        }
        gym.save((err,gym)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        })
    })
}


exports.getAllGymNotificationByBranch=(req,res)=>{
    let gym=req.gym;
    Notification.find({_id:gym.notification_list}).exec((err,notifications)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(notifications);
    })
}




//member

exports.createMemberNotification=(req,res)=>{
    let notification=new Notification(req.body);
    let member=req.member;

    notification.save((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let currentdate=new Date.now();
        let date=new Date(currentdate);
        date.setDate(date.getDate()+7);
        let job=schedule.scheduleJob(date, function(){
            job.cancel();
            notification.remove((err,notification)=>{
                if(err){
                    console.log("error in db")
                }else{
                    let index=member.notification_list.indexOf(notification._id);
                    if(index>-1){
                        createMemberNotification.notification_list.splice(index,1);
                    }
                    member.save((err,member)=>{
                        if(err) console.log("error in deleting notification")
                        else console.log("successfully deleted")
                    })
                }
            })
        });
        member.notification_list.push(notification._id);
        member.save((err,member)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        });
    })
};


exports.removeMemberNotification=(req,res)=>{
    let notification=req.notification;
    let member=req.member;

    notification.remove((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let index=member.notification_list.indexOf(notification._id);
        if(index>-1){
            member.notification_list.splice(index,1);
        }
        member.save((err,member)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        })
    })
}



exports.getAllMemberNotification=(req,res)=>{
    let member=req.member;
    Notification.find({_id:member.notification_list}).exec((err,notifications)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(notifications);
    })
}





//branch admin

exports.createBranchAdminNotification=(req,res)=>{
    let notification=new Notification(req.body);
    let branchadmin=req.branchadmin;

    notification.save((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let currentdate=new Date.now();
        let date=new Date(currentdate);
        date.setDate(date.getDate()+7);
        let job=schedule.scheduleJob(date, function(){
            job.cancel();
            notification.remove((err,notification)=>{
                if(err){
                   console.log("error in db")
                }else{
                    let index=branchadmin.notification_list.indexOf(notification._id);
                    if(index>-1){
                        branchadmin.notification_list.splice(index,1);
                    }
                    branchadmin.save((err,branchadmin)=>{
                        if(err) console.log("error in deleting notification")
                        else console.log("successfully deleted")
                    })
                }
            })
        });
        branchadmin.notification_list.push(notification._id);
        branchadmin.save((err,member)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        });
    })
};


exports.removeBranchAdminNotification=(req,res)=>{
    let notification=req.notification;
    let branchadmin=req.branchadmin;

    notification.remove((err,notification)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        let index=branchadmin.notification_list.indexOf(notification._id);
        if(index>-1){
            branchadmin.notification_list.splice(index,1);
        }
        branchadmin.save((err,branchadmin)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                })
            }
            res.json(notification);
        })
    })
}



exports.getAllBranchAdminNotification=(req,res)=>{
    let branchadmin=req.branchadmin;
    Notification.find({_id:branchadmin.notification_list}).exec((err,notifications)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(notifications);
    })
}



