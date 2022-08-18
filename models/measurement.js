const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var measurementtestSchema=new mongoose.Schema({
    name:{
        type:String,
        default:"Fitness Measurement"
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
       ref:"Measurement"
    },
    member:{
       type:ObjectId,
       ref:"Member"
    }
});


module.exports=mongoose.model("Measurement",measurementtestSchema);