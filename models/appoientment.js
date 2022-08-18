const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

const appoientmentSchema=new mongoose.Schema({
    reason:{
        type:String,
        default:""
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    book:{
        date:{
            type:String,
        },
        time:{
            type:String
        },
        remark:{
            type:String
        }
    },
    complete:{
        date:{
            type:String
        },
        time:{
            type:String
        },
        remark:{
            type:String
        }
    },
    statusLog:{
        type:String,
        default:"Pending"
    },
    isComplete:{
        type:Boolean,
        default:false
    },
    planner:{
        type:ObjectId,
        ref:"Planner"
    },
    member:{
        type:ObjectId,
        ref:'Member'
    },
    branchadmin:{
        type:ObjectId,
        ref:"BranchAdmin"
    }
});


module.exports=mongoose.model("Appoientment",appoientmentSchema);