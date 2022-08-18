const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var branchSchema=new mongoose.Schema({
    branchName:{type:String,maxlength:120},
    branchemail:{type:String,trim:true,unique:true},
    branchphone:{type:Number,trim:true,unique:true},
    optional_branchemail:{type:String,trim:true,default:"NILL"},
    optional_branchphone:{type:String,trim:true,default:"NILL"},
    state:{type:String},
    location:{type:String},
    city:{type:String},
    address:{type:String},
    pincode:{type:String},
    active:{type:Boolean,default:true},
    gymId:{type:ObjectId,ref:"Gym"},
    gymName:{type:String},
    branchmanager:{
        firstname:{type:String,maxlength:15},
        lastname:{type:String,maxlength:15},
        email:{type:String,trim:true},
        phone:{type:Number},
        user:{type:ObjectId,ref:"User"},
        active:{type:Boolean,default:true}
    },
    notification_list:[{type:ObjectId,ref:"Notification"}],
    testList:[{type:ObjectId,ref:"Test"}],
    plannerList:[{type:ObjectId,ref:"Planner"}],
    branchAdminList:[{type:ObjectId,ref:"BranchAdmin"}],
    memberList:[{type:ObjectId,ref:"Member"}]
});

module.exports=mongoose.model("Branch",branchSchema);