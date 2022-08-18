const mongoose = require("mongoose");
const {ObjectId}=mongoose.Schema;


var phybodycomptest=new mongoose.Schema({
    test_name:{
        type:String,
        default:"Physical & Body Composition Test"
    },
    date:{
       type:String,
       required:true
    },
    time:{
        type:String
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
            }
        }
    ],
    remark:{
        type:String
    },
   files:[
       {
           type:String,
           trim:true
       }
   ],
   sync_test:{
       type:ObjectId,
       ref:"PhyBodyCompTest"
   },
   member:{
       type:ObjectId,
       ref:"Member"
   }
})

module.exports = mongoose.model("PhyBodyCompTest",phybodycomptest);