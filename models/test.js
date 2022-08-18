const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var testSchema=new mongoose.Schema({
    test_name:{
        type:String
    },
    unit_type:{
        type:String,
        default:"Weight"
    },
    test_type:{
        type:Number,
        default:0
    },
});

module.exports=mongoose.model("Test",testSchema);