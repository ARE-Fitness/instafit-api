const express =  require('express');
const router=express.Router();

const {getUserById}=require('../controllers/user');
const {isSignedIn,isAdmin, isAuthenticated}=require("../controllers/auth");
const {getParameterById,getParameter,addParameter,updateParameter,getAllParameters,getPhotoParameter, deleteParameter} =require("../controllers/parameter");

router.param("userId",getUserById);
router.param("parameterId",getParameterById);



router.post("/create/parameter/:userId", isSignedIn,isAuthenticated,isAdmin, addParameter);
router.put("/update/parameter/:userId/:parameterId",isSignedIn,isAuthenticated,isAdmin,updateParameter);

router.get("/parameter/:userId/:parameterId",isSignedIn,isAuthenticated,getParameter);
router.get("/parameters/:userId?",isSignedIn,isAuthenticated,getAllParameters);
router.get("/parameter/photo/:userId/:parameterId",isSignedIn,isAuthenticated,getPhotoParameter);

router.delete("/delete/parameter/:userId/:parameterId",isSignedIn,isAuthenticated,isAdmin,deleteParameter);

module.exports=router;