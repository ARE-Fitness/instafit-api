const mongoose=require('mongoose');
const demoschema=new mongoose.Schema({
    Gender:{type:String},
    Country:{type:String},
    Age:{type:String},
    Date:{type:String},
    Id:{type:String}
})

module.exports=mongoose.model(`DemoSchema`,demoschema);