const mongoose=require('mongoose');
const {ObjectId} = mongoose.Schema;

const medicalConditions=[
    {
        question:"Are you currently under a doctor's supervision ?",
        status:false,
        attributes:[
            {
                item:"Doctor",
                value:"Doctor Name"
            },
            {
                item:"Condition",
                value:"Med Condition"
            }
        ]
    },
    {
        question:"Have you ever had an exercise stress test ?",
        status:false,
        attributes:[
            {
                item:"Doctor",
                value:"Doctor Name"
            },
            {
                item:"Condition",
                value:"Med Condition"
            }
        ]
    },
    {
        question:"Do you smoke ?",
        status:false,
        attributes:[
            {
                item:"Frequency",
                value:"Select Frequency"
            },
            {
                item:"Since",
                value:"Select Date"
            }
        ]
    },
    {
        question:"Do you take alcohol?",
        status:false,
        attributes:[
            {
                item:"Drink",
                value:"Ocationally"
            },
            {
                item:"Since",
                value:"Select Date"
            }
        ]
    },
    {
        question:"Are you pregnant?",
        status:false,
        attributes:[
            {
                item:"Phase",
                value:"Phase 1"
            }
        ]
    },
    {
        question:"Is your stress level high?",
        status:false,
        attributes:[
           
        ]
    },
    {
        question:"High Blood Pressure ?",
        status:false,
        attributes:[
            {
                item:"SBP",
                value:"SBP Value"
            },
            {
                item:"SBP_Date",
                value:"Select Date"
            },
            {
                item:"DBP",
                value:"DBP Value"
            },
            {
                item:"DBP_Date",
                value:"Select Date"
            }
        ]
    },
    {
        question:"High cholestrol ?",
        status:false,
        attributes:[
           {
               item:"Result",
               value:"0",
               unit:'mg/dl'
           }
        ]
    },
    {
        question:"Diabetes ?",
        status:false,
        attributes:[
            {
                item:"Result",
                value:"0",
                unit:'mg/dl'
            },
            {
                item:"Type",
                value:"0"
            }
        ]
    },
    {
        question:"Any bone or joint injury in the past ?",
        status:false,
        attributes:[
            {
                item:"Detail",
                value:"0"
            }
        ]
    },
    {
        question:"Any muscle or ligament injury in the past?",
        status:false,
        attributes:[
            {
                item:"Detail",
                value:"0"
            }
        ]
    }

]

const medicalHealthSchema=new mongoose.Schema({
  
    Conditions:{
        type:Array,
        default:medicalConditions
    },
    medical_clearence_document:{
        type:String,
        default:""
    },
    isUploaded:{
        type:Boolean,
        default:false
    },
    other_conditions:{
        type:String,
        default:""
    },
    member:{
        type:ObjectId,
        ref:"Member"
    },

});

module.exports=mongoose.model("MedicalHealth",medicalHealthSchema)