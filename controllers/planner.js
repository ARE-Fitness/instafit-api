const Planner=require("../models/planner");
const Day=require("../models/day");
const Member=require("../models/member");
const Calender=require("../models/calender");
const Exercise=require("../models/exercise");
const PlannerHistory=require('../models/planner_history');
const DailyExerciseEvent=require("../models/daily_ex_event");
const exercise = require("../models/exercise");
const schedule=require('node-schedule');
const Appoientment=require(`../models/appoientment`);
const Notification=require('../models/notification');
const Branch=require("../models/branch");
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox6d990d2d1af24a8fb9c64b1924b6782e.mailgun.org';
const mg = mailgun({apiKey: process.env.Mailgun_API_Key, domain: DOMAIN});

exports.getPlannerById=(req,res,next,id)=>{
    Planner.findById(id).exec((err,planner)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            })
        }
        req.planner=planner;
        next();
    })
};

exports.getPlanner=(req,res)=>{
    res.json(req.planner);
};

exports.createPlanner=(req,res)=>{
    let planner=new Planner(req.body);
    planner.save((err,planner)=>{
        if(err){
                return res.status(400).json({
                    error:"Error in Db"
                })
        }
       // req.branch.plannerList.push(planner._id);
      //  req.branch.save();
        res.json(planner);
    })
};

exports.getAllPlanner=(req,res)=>{
     let {limit=10,page=1}=req.query;
     let branch=req.branch;
     Planner.find({_id:branch.plannerList})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,planners)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            })
        }
        res.json(planners)
    })
};

exports.updatePlanner=(req,res)=>{
   Planner.findOneAndUpdate(
       {_id:req.planner._id},
       {$set:req.body},
       {new: true, useFindAndModify: false},
       (err,planner)=>{
           if(err){
               return res.status(400).json({
                   error:"Error in Db"
               })
           }
           res.json(planner);
       }
   )   
};

exports.getTotalPlannerPage=(req,res)=>{
    let {limit=8}=req.query;
    Planner.find({_id:req.branch.plannerList},{_id:1}).exec((err,planners)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }

        res.json({
            total:planners.length,
            page:Math.ceil(planners.length/parseInt(limit))
        });
    })
};

exports.deletePlanner=(req,res)=>{
    let planner=req.planner;
    let branch=req.branch;
    planner.remove((err,planner)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        var index=branch.plannerList.indexOf(planner._id);
        if(index>-1){
            branch.plannerList.splice(index,1);
        }
        branch.save((err,branch)=>{
            if(err){
                return res.status(400).json({
                    error:"Error in db"
                });
            }
            res.json(planner);
        });
    })
};

exports.assignPlannerToMember=async (req,res)=>{
    let {  planner_duration,planneroffdays,planner_startDate }=req.body,planner=req.planner,member=req.member,exercises=[],events=[];
    var  counter=0,daysexercises=[],exercise_events=[],dates=[],weekDays=["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], weekValues=[];
    
    try{
        // let plannerhistory=await savePlannerHistory(member);
       
        exercises=await getExercises(planner);
        weekValues=await getAllWeeks(planneroffdays,weekDays);
        daysexercises=await findDayExercisesList(exercises);
        dates=await getAllExerciseDates(planner_startDate,weekValues,planner_duration);
    
       
      

        for(var k=0;k<dates.length;k++){
            let event={};
            //calculate and events
            let weekday=["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            let dateobj=new Date(dates[k])
            event.ex_name=planner.days_display_names[weekValues.indexOf(weekday[dateobj.getDay()])];
            event.exercise=daysexercises["day"+weekValues.indexOf(weekday[dateobj.getDay()])];
            event.date=dates[k];
            exercise_events.push(event);
            counter++;
            if(counter==exercises.length){
                counter=0;
            }
        }
    
        events=await saveEvents(exercise_events);
        await saveCalenders(events,member.calender);
        // if(plannerhistory){
        //     member.planner_history_list.push(plannerhistory._id);
        // }
        member.planner=planner._id;
        member.planner_startDate=planner_startDate;
        member.planner_name=planner.planner_name;
        member.planner_duration=planner_duration;
        let dateAttr=dates[dates.length-1].split("-");
        let date=new Date(parseInt(dateAttr[0]),(parseInt(dateAttr[1])-1),parseInt(dateAttr[2]),23,0,0);
        let job=schedule.scheduleJob(date, function(){
            job.cancel();
            let appoientment=new Appoientment();
            appoientment.reason="Workout counciling appoientment";
            appoientment.member=member._id;
            appoientment.planner=planner._id;
            //notification
            let notification=new Notification();
            notification.title="Appoientment alert";
            notification.description="Appoientment is generated for "+ member.mfname+" "+member.mlname+".";
            notification.actionLog="appoientment";
            notification.save((err,notification)=>{
                if(err) console.log('error creating notification');
                else {

                let data = {
                from: 'noreplay@instafitindia.com',
                to: email,
                subject: notification.title,
                html:`
                    <h6>${notification.description}</h6>
                `
                };
                mg.messages().send(data, function (error, body) {
                    if(error){
                        console.log("Error something went wrong please try again")
                    }else{
                        console.log("Email is sent")
                    }
                });

                Branch.findOne({
                    _id:member.branchId
                }).exec((err,branch)=>{
                    if(err){
                        console.log("error finding branch")
                    }else{
                        member.notification_list.push(notification._id);
                        branch.notification_list.push(notification._id);
                        branch.save((err,member)=>{
                            if(err) console.log("unable to save the data");
                            else console.log("sucessfully notification created")
                        })
                        member.save((err,member)=>{
                            if(err) console.log("unable to save the data");
                            else console.log("sucessfully notification created")
                        });
                        let currentdate=new Date.now();
                        let date=new Date(currentdate);
                        date.setDate(date.getDate()+7);
                        let job1=schedule.scheduleJob(date, function(){
                            job1.cancel();
                            notification.remove((err,notification)=>{
                                if(err){
                                    console.log("error in db")
                                }else{

                                        let indexmember=branch.notification_list.indexOf(notification._id);
                                        let indexbranch=branch.notification_list.indexOf(notification._id);
                                        if(indexbranch>-1){
                                            branch.notification_list.splice(indexbranch,1);
                                        }
                                        if(indexmember>-1){
                                            member.notification_list.splice(indexmember,1)
                                        }
                                        branch.save((err,branch)=>{
                                            if(err) console.log("error in deleting notification")
                                            else console.log("successfully deleted")
                                        })
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
            })
            
            //end of code
            Appoientment.save((err,appoientment)=>{
                if(err){
                    console.log("Error in db")
                }else{
                    member.appoientmentList.push(appoientment._id);
                    member.save((err,member)=>{
                        if(err){
                            console.log("Error in db")
                        }else{
                            console.log("Appoientment is created")
                        }
                    })
                }
            })
          
           
        });

        member.save((err,member)=>{
            if(err){
                throw "Error in db"
            }

            let notification=new Notification();
            notification.title="Planner alert";
            notification.description="Your planner has been assigned by  branch admin";
            notification.actionLog="planner_assign";
            notification.save((err,notification)=>{
                if(err) console.log('unable to create the notification')
                else{
                    console.log('notification is created');
                    let data = {
                    from: 'noreplay@instafitindia.com',
                    to: email,
                    subject: notification.title,
                    html:`
                        <h6>${notification.description}</h6>
                    `
                    };
                    mg.messages().send(data, function (error, body) {
                        if(error){
                            console.log("Error something went wrong please try again")
                        }else{
                            console.log("Email is sent")
                        }
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
                             
                                let index=member.notification_list.indexOf(notification._id);
                                if(index>-1){
                                    member.notification_list.splice(index,1);
                                }
                                member.save((err,member)=>{
                                    if(err) console.log("error in deleting notification")
                                    else console.log("successfully deleted")
                                })
                            }
                        })
                    });
                    
                }
            });
       
            res.json(member);
          
        });  
    }catch(err){
        return res.status(400).json({
            error:err
        })
    } 
};
//exercise methods
const findDayExercisesList=(exercises)=>{
    let dailyexerciselist={
        "day0":[],
        "day1":[],
        "day2":[],
        "day3":[],
        "day4":[],
        "day5":[],
        "day6":[]
    };
   
    for(let key in exercises){
        dailyexerciselist["day"+(exercises[key].day_number-1)].push(exercises[key]._id);
    }
    return dailyexerciselist;
}
//not in use
//const savePlannerHistory=(member)=>{
    // let plannerhistory=new PlannerHistory();
    // if(member.planner!=""){
    //     plannerhistory.planner_name=member.planner_name;
    //     plannerhistory.planner_startDate=member.planner_startDate;
    //     plannerhistory.member=member._id;
    //     Planner.findOne({_id:member.planner}).exec((err,planner)=>{
    //         if(err){
    //             return res.status(400).json({
    //                 error:"Error in db"
    //             });
    //         }
    //         plannerhistory.exdays=planner.exdays;   
    //         plannerhistory.save();
    //     });
    //     return plannerhistory; 
    // }
//};
const saveCalenders=(eventlist,calender)=>{
    let events=[];
    eventlist.forEach(element=>{
        events.push(element._id);
    });
   Calender.findOneAndUpdate(
       {_id:calender},
       {$set:{events:events}},
       {useFindAndModify:false,new:true},
       (err,calender)=>{
           if(err){
               throw "Error in db"
           }
           return true;
       }
   )
};
const saveEvents=(exercise_events)=>{
        
    return DailyExerciseEvent.insertMany(exercise_events).then(data=>data).catch(err=>{
        throw "Error in db"
    });

};
const getExercises=(planner)=>{
    return Exercise.find({_id:planner.exdays},(err,exercises)=>{
        if(err){
            throw "Error in db"
        }else{
            return exercises;
        }
    });
};
const getDaysInMonth = (month,year)=>{
    return new Date(year, month, 0).getDate();
};
const getAllExerciseDates=(planner_startDate,weekValues,planner_duration)=>{

    var splitValue=planner_startDate.split("-"),weekDays=["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var cDate=[],cTrack=0,M=splitValue[1],D=splitValue[2],Y=splitValue[0],date="",d,mDays=0;
    while(parseInt(planner_duration)>cTrack){
        date=Y+"-"+M+"-"+D;
        splitValue=date.split("-");
        mDays=getDaysInMonth(splitValue[1],splitValue[0]);
        d=new Date(date);
        for(var j=0;j<weekValues.length;j++){
            if(weekValues[j]==weekDays[d.getDay()]){
                cDate.push(date);
            }
        }
        cTrack++;
        D=parseInt(D)+1;
        if(D>mDays){
            D=1;
            M=(parseInt(M)+1);
            if(M==13){
             M=1;
             Y=(parseInt(Y)+1);
            }
        }
        if(D<10){
            D=parseInt(D)+0;
            D="0"+D;
        }
        if(M<10){
            M=parseInt(M)+0;
            M="0"+M;
        }
    }



   return cDate;
};
const getAllWeeks=(planneroffdays,weekDays)=>{
    if(planneroffdays.length!=0){
        planneroffdays.forEach(element => {
            let index=weekDays.indexOf(element);
            if(index>-1){
                weekDays.splice(index,1);
            }
        });
    }
    return weekDays;
};



//check BranchAdmin exist in the server or not
exports.checkPlannerStatus=(req,res)=>{

    let {field,value}=req.query;
    let branch=req.branch;

    Planner.findOne({
      [field]:value,
      _id:branch.plannerList
    }).exec((err,planner)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        })
      }
      if(planner){
        res.json({
          message:"branch already exist",
          found:true
        })
      }
      if(!planner){
        res.json({
          message:"no branch found",
          found:false
        })
      }
    })
    
  
}


exports.getAllPlanners=(req,res)=>{
    let {active}=req.query;
    Planner.find({active}).exec((err,planners)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json(planners)
    })
}