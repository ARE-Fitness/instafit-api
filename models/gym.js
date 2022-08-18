const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;


var gymSchema=new mongoose.Schema({
     gymName:{type:String,required:true},
     email:{type:String,required:true,unique:true,trim:true},
     optional_email:{type:String,trim:true,default:"NILL"},
     phone:{type:Number,unique:true,trim:true,required:true},
     optional_phone:{type:String,trim:true,default:"NILL"},
     address:{type:String},
     location:{type:String},
     city:{type:String},
     state:{type:String},
     pincode:{type:String,trim:true},
     active:{type:Boolean,default:true},
     gymtype:{type:Number,default:0},//0 comercial , 1 residencial and 2 corporate
     gymAdmin:{
      type:ObjectId,
      ref:"User"
     },
     gymManager:{
        firstname:{type:String},
        lastname:{type:String},
        photoId:{type:String,trim:true},
        email:{type:String,trim:true},
        phone:{type:Number}
    },
    owner:{
      firstname:{type:String},
      lastname:{type:String},
      photoId:{type:String,trim:true},
      email:{type:String,trim:true},
      phone:{type:Number}
    },
    notification_list:[{type:ObjectId,ref:"Notification"}],
    branchList:[{type:ObjectId,ref:"Branch"}],
    contentList:[{type:ObjectId,ref:"Content"}],
    extypeList:[{type:String}],
    tgmsclList:[{type:String}],
    exlevelList:[{type:String}],
    parameterList:[{type:String}],
    testList:[{type:ObjectId,ref:"Test"}]
});

module.exports=mongoose.model("Gym",gymSchema);