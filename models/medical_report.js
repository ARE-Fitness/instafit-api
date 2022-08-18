const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

var medicalReportSchema=new mongoose.Schema({
    medic_condition:{ //example heart issue or injuries
        type:String,
    },
    link:{
        type:String,
        trim:true
    },
    remark:{
      type:String 
    },
    isfileupload:{ //true-upload s3 false-add link
       type:Boolean,
       default:true
    }
});

module.exports=mongoose.model("MedicalReport",medicalReportSchema);