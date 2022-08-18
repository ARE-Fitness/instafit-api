const Content=require("../models/content");
const Exercise=require("../models/exercise")
const Vimeo = require('vimeo').Vimeo;
//const client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

exports.getContentById=(req,res,next,id)=>{   
    Content.findById(id).exec((err,content)=>{
    if(err){
        return res.status(400).json({
            error: "Error in DB"
        });
    }
    req.content=content;
    next();
});
};



exports.getContent=(req,res)=>{
    res.json(req.content);
};


exports.createContent=(req,res)=>{
    let content=new Content(req.body);
    content.gymName=req.gym.gymName;
    content.gymId=req.gym._id;
    content.save((err,content)=>{
        if(err){
            return res.status(400).json({
                 error:"Error in DB" 
                })
        }
        req.gym.contentList.push(content._id);
        req.gym.save((err,gym)=>{
            res.json(content);
        });
    })
}


exports.updateContent=(req,res)=>{
    Content.findOneAndUpdate(
        {_id: req.content._id},
        {$set:req.body},
        {new: true, useFindAndModify: false},
        (err,content)=>{

            if(err){
                return res.status(400).json({
                    error: "Error to connect with content  DB"
                });
            }
            res.json(content);
        }
    );
}



exports.blockOpContent=(req,res)=>{
    let {active}=req.body;
    let content=req.content;
    content.active=active;
    content.save((err,content)=>{
      if(err){
        return res.status(400).json({
          error:"Error in DB"
        });
      }
  
      res.json(content);
  
    })
  
};


exports.getAllInActiveContentByGym=(req,res)=>{
    
    let {limit=9,page=1}=req.query;
    Content.find({_id:req.gym.contentList,active:false})
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in DB"
            });
        }

       res.json(contents);
   });

};
exports.getAllActiveContentByGym=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Content.find({_id:req.gym.contentList,active:true})
    skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
         if(err){
             return res.status(400).json({
                 error:"Error in DB"
             });
         }

        res.json(contents);
    });
};


//get all warm up function
exports.getAllActiveWarmUpExercise=(req,res)=>{
    let {limit=10,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:0,
        active:true,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }

        res.json(contents);
    })
}

exports.getAllInActiveWarmUpExercise=(req,res)=>{
    let {limit=10,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:0,
        active:false,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(contents);
    })
}
//get all main exercise function
function searchText(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.getAllActiveMainExercise=(req,res)=>{
    let {limit=10,page=1}=req.query;
    //let {limit=10,page=1,text="",exType="",exLable}=req.query;
   // let regex = new RegExp(searchText(text), 'gi');
    //let {targetmuscleList}=req.body;
    Content.find({
        _id:req.gym.contentList,
        exMode:1,
        // targetMscl:{$all:targetmuscleList},
        // exType:exType==""?/^/:new RegExp('/'+exType+'/'),
        // exLable:exLable==""?/^/:new RegExp('/'+exLable+'/'),
        // perameters:perameters==""?/^/:new RegExp('/'+perameters+'/'),
        // exName:regex,
        active:true,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }

        res.json(contents);
    })
}

exports.getAllInActiveMainExercise=(req,res)=>{
    let {limit=10,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:1,
        active:false,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(contents);
    })
}
//get all cool down exercise function
exports.getAllActiveCoolDownExercise=(req,res)=>{
    let {limit=10,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:2,
        active:true,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }

        res.json(contents);
    })
}

exports.getAllInActiveCoolDownExercise=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:2,
        active:false,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(contents);
    })
}

exports.getAllSelectedContents=(req,res)=>{
    let {exerciselist}=req.body;
    let contents=[];
    let totalprocess=0;
    //console.log(exerciselist)

    Exercise.find({_id:exerciselist}).exec((err,exercises)=>{
        if(err){
            return res.status(400).json({
                error:"error  in db"
            });
        }
        
        exercises.forEach(exercise => {
          totalprocess++;
          let contentIds=[];
          contentIds.push(exercise.content);
        //   for(let key in exercise.optionalEx){
        //     if(exercise.optionalEx[key]["content"]!=null||exercise.optionalEx[key]["content"]!=undefined)
        //        contentIds.push(exercise.optionalEx[key]["content"])
        //   }
          contentIds.forEach(id=>{
            contents.push(id);
          })
          if(totalprocess==exercises.length){
            console.log(contents)
            Content.find({_id:contents}).exec((err,contentlist)=>{
               
                if(err){
                    return res.status(400).json({
                        error:"Error in db"
                    })
                }
                res.json(contentlist);
            });
          }
        });
    });
}

//fitness content

exports.getAllActiveFitnessContent=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:3,
        active:true,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }

        res.json(contents);
    })
}

exports.getAllInActiveFitnessContent=(req,res)=>{
    let {limit=9,page=1}=req.query;
    Content.find({
        _id:req.gym.contentList,
        exMode:3,
        active:false,
    })
    .skip((parseInt(page)-1)*limit).limit(parseInt(limit))
    .exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in Db"
            });
        }
        res.json(contents);
    })
}

exports.getPageTotalContent=(req,res)=>{
    let {limit=8,exMode=0,active=true}=req.query;
    let gym=req.gym;

    Content.find({ _id:gym.branchList, exMode, active }).exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }
        res.json({
            page:Math.ceil(contents.length/parseInt(limit)),
            total:contents.length
        })
    })
}

//check BranchAdmin exist in the server or not
exports.checkContentStatus=(req,res)=>{

    let {field,value}=req.query;
    let gym=req.gym;

    Content.findOne({
      [field]:value,
      _id:gym.contentList
    }).exec((err,content)=>{
      if(err){
        return res.status(400).json({
          error:"Error in db"
        })
      }
      if(content){
        res.json({
          message:"content already exist",
          found:true
        })
      }
      if(!content){
        res.json({
          message:"no content found",
          found:false
        })
      }
    })
    
  
}


exports.getAllContents=(req,res)=>{
    let {active=true}=req.query;
    Content.find({active}).exec((err,contents)=>{
        if(err){
            return res.status(400).json({
                error:"Error in db"
            })
        }else{
            res.json(contents)
        }
    })
}
