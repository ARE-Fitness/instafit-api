const PlannerHistory=require("../models/planner_history");


exports.getPlannerHistoryById=(req,res,next,id)=>{
    PlannerHistory.findById(id).exec((err,plannerhistory)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            });
        }
        req.plannerhistory=plannerhistory;
        next();
        res.json(plannerhistory);
    })
};


exports.getPlannerHistory=(req,res)=>{
    res.json(req.plannerhistory);
};


exports.getAllPlannerHistoryByMember=(req,res)=>{
    let {limit=8,page=1}=req.query;
    PlannerHistory.find({_id:req.member.planner_history_list})
    .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit))
    .exec((err,plannerhistorys)=>{
        if(err){
           return res.status(400).json({
                error:"Error in Db"
            });
        }
        console.log(plannerhistorys)
        res.json(plannerhistorys);
    })
}

exports.totalPlannerHistoryAndPage=(req,res)=>{
    let {limit=8}=req.query;

    PlannerHistory.find({_id:req.member.planner_history_list},{_id:1}).exec((err,planner_history_list)=>{
        if(err){
          return res.status(400).json({
            error:"Error in db"
          });
        }
         
        res.json({
            page:Math.ceil(planner_history_list.length/limit),
            total:planner_history_list.length
        });
    });

}