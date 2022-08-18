const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var fitnesstestSchema=new mongoose.Schema({
    test_name:{
        type:String,
        default:"Fitness Test"
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    test_list:[
        {
            name:{
                type:String,
                required:true
            },
            result:{
                type:Number,
                required:true
            },
            unit:{
                type:String,
                required:true
            },
            flag:{
                type:String,
                required:true
            },
            goal:{
                type:String,
            }
        }
    ],
    remark:{
        type:String
    },
    sync_test:{
       type:ObjectId,
       ref:"FitnessTest"
    },
    member:{
        type:ObjectId,
        ref:"Member"
    }
});


module.exports=mongoose.model("FitnessTest",fitnesstestSchema);