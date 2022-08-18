const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

var notificationSchema=new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now(),
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    actionLog:{
        type:String,
        required:true
    },
    seened:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model("Notification",notificationSchema);