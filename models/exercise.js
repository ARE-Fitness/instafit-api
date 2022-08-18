const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema;

var  exerciseSchema=new mongoose.Schema({
    freq_number:{
        type:Number
    },
    day_number:{
        type:Number,
    },
    unit:{
        type:String,
        default:"weight[KG]"
    },
    defaultvalue:{
        type:Number,
        default:0
    },
    set:{
        type:Number,
        default:0
    },
    rep:{
        type:Number,
        default:0
    },
    content:{
        type:ObjectId,
        ref:"Content"
    },
    optionalEx:{
        type:Array,
        default:[
            {
                unit:"weight[KG]",
                defaultvalue:56,
                set:0,
                rep:0,
                content:""
            },
            {
                unit:"weight[KG]",
                defaultvalue:56,
                set:0,
                rep:0,
                content:""
            }
        ]
    },
    active:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model("Exercise",exerciseSchema);