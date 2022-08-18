const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

var parameterSchema = new mongoose.Schema({
    type: {
        type: Number,
        default : 0, // type 0 (Exercise Level), type 1 (Exercise Type), type 2 (Target Muscle) 
    },
    name: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        default: ""
    },
    isPhotoUploaded: {
        type: Boolean,
        default: false
    }
});

module.exports=mongoose.model("Parameter", parameterSchema);