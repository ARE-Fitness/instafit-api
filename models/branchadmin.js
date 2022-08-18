const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var branchAdminSchema=new mongoose.Schema({
    bfname:{
        type:String,
        maxlength:120,
        minlength:3,
        required:true
    },
    blname:{
        type:String,
        maxlength:120,
        minlength:3,
        required:true
    },
    bemail:{
        type:String,
        trim:true,
        required:true
    },
    bphone:{
        type:Number,
        required:true
    },
    baddress:{
        type:String,
        default:""
    },
    blocation:{
        type:String,
        default:""
    },
    bstate:{
        type:String,
        default:""
    },
    bcity:{
        type:String,
        default:""
    },
    bpincode:{
        type:Number
    },
    specialization:{
        type:Array,
        default:[]
    },
    bio:{
        type:String,
        default:""
    },
    role:{
        type:Number,//4 manager 5 instructor 6 programmer
        default:4
    },
    userId:{
        type:ObjectId,
        ref:"User"
    },
    branchName:{
        type:String
    },
    branchId:{
        type:ObjectId,
        ref:"Branch"
    },
    notification_list:[{type:ObjectId,ref:"Notification"}],
    active:{
        type:Boolean,
        default:true
    }
});


module.exports=mongoose.model("BranchAdmin",branchAdminSchema);