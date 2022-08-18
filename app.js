require('dotenv').config();
const mongoose=require('mongoose');
const express=require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet=require('helmet');
const gymRoutes=require('./routes/gym');
const userRoutes=require('./routes/user');
const app=express();
const contentRoutes=require("./routes/content");
const authRoutes=require("./routes/auth");
const branchRoutes=require("./routes/branch");
const branchadminRoutes=require("./routes/branchadmin");
const plannerRoutes=require("./routes/planner");
const testRoutes=require("./routes/test");
const memberRoutes=require("./routes/member");
const notificationRoutes=require('./routes/notification');
const workoutReportRoutes=require('./routes/workout_report');
const appoientmentRoutes=require('./routes/appoientment');
const parametersRoutes=require("./routes/parameter");
const  medicalHealthRoutes =require('./routes/medical_health');

//test code 
const schedule=require('node-schedule');

//test code
const XLSX=require('xlsx');
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const DemoSchema=require('./models/demoschema');
//emd of test

//const path=require('path');
// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200
//   }

//DB connection
mongoose.connect(process.env.DB,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("DB CONNECTED");
});

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());


//midleware
app.use("/api",gymRoutes);
app.use("/api",userRoutes);
app.use("/api",authRoutes);
app.use("/api",contentRoutes);
app.use("/api",branchRoutes);
app.use('/api',branchadminRoutes);
app.use('/api',plannerRoutes);
app.use('/api',testRoutes);
app.use('/api',memberRoutes);
app.use('/api',workoutReportRoutes);
app.use("/api",notificationRoutes);
app.use("/api",appoientmentRoutes);
app.use("/api",parametersRoutes);
app.use("/api",medicalHealthRoutes);


app.post('/test-fileread',function(req,res){
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          error: "problem with image"
        });
      }

      var workbook = XLSX.readFile(file.excel.path, {
        type: 'binary'
      });
      var dataschema=[];
      workbook.SheetNames.forEach(function(sheetName) {
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        dataschema.push(JSON.parse(json_object));
      })


      DemoSchema.insertMany(dataschema[0]).then(()=>{
          res.json("created successfully")
      }).catch(()=>{
          res.json("bal falaiso")
      });

 
 
    });
})

app.get('/test-job',function(req,res){
    console.log("starting job")
    const date = new Date(2021, 8, 10, 23, 0, 0);
    console.log(date)
    const job = schedule.scheduleJob(date, function(){
      console.log('The world is going to end today.');
    });
    // const startTime = new Date(Date() + 5000);
    // const endTime = new Date(startTime.getTime() + 5000);
    // const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
    //     job.cancel()
    //     res.json('Time for tea!');
     
    // });

})

//for server test
// app.get("/server/member/test",function(res,res){
//     res.sendFile(path.join(__dirname+'/views/login.html'));
// })

//PORT
const port=process.env.PORT || 5000;
//port listening
app.listen(port,()=>{console.log(`server is running at port ${port}`)});
