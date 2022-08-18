const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var lectureSchema=new mongoose.Schema({
  
    lecture_name:{
        tyep:String,
        default:""
    },
    lecture:{
        type:ObjectId,
        ref:"Content"
    },
    alt_lecture_name:{
        tyepe:String,
        default:""
    },
    alter_lecture:{
        type:ObjectId,
        ref:"Content"
    }

});

module.exports=mongoose.model("Lecture_Alter",lectureSchema);