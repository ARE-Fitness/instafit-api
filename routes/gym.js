const express=require('express');
const router=express.Router();

const {getGym,getGymById,authenticateGymProfile,getAllActiveGym,blockOpGym,totalInActiveGym,createGym,IsGymActive,popExlableFromGym,popTgmsclFromGym,getAllInActiveGym,updateGym,popExtypeFromGym, addExtypeToGym,photoGym, addTgmsclToGym, addExlableToGym, assignGymAdmin,removeGymAdmin, totalActiveGym, gettotalList, checkGymStatus}=require('../controllers/gym');
const {getUserById}=require('../controllers/user');
const {isSignedIn,isAdmin,isInstaFitGymAdmin,isInstaFitGymBranchAdmin, isAuthenticated}=require("../controllers/auth");



router.param("userId",getUserById);
router.param("gymId",getGymById);

//exercise type add and remove
router.post("/gym-user-add-extype/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,addExtypeToGym);
router.post("/gym-user-pop-extype/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,popExtypeFromGym);
//exercise muscle add and remove
router.post("/gym-user-add-exmuscl/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,addTgmsclToGym);
router.post("/gym-user-pop-exmuscl/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,popTgmsclFromGym);
//exercise level
router.post("/gym-user-add-exlable/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,addExlableToGym);
router.post("/gym-user-pop-exlable/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,popExlableFromGym);
//gym add,get,update operation
router.post("/register-gym/:userId",isSignedIn,isAuthenticated,isAdmin,createGym);
router.put("/update-gym/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,updateGym);
router.get("/get-all-gym-active/:userId?",isSignedIn,isAuthenticated,isAdmin,getAllActiveGym);
router.get("/get-all-gym-inactive/:userId?",isSignedIn,isAuthenticated,isAdmin,getAllInActiveGym);
router.get("/get-total-page-active-gym/:userId?",isSignedIn,isAuthenticated,isAdmin,totalActiveGym);
router.get("/get-total-page-inactive-gym/:userId?",isSignedIn,isAuthenticated,isAdmin,totalInActiveGym);
router.post("/insft-create-gym-admin/:userId/:gymId",isSignedIn,isAuthenticated,isAdmin,assignGymAdmin);
router.delete("/insft-remove-gym-admin/:userId/:gymId",isSignedIn,isAuthenticated,isAdmin,removeGymAdmin);
router.get("/gym-get/:userId/:gymId",isSignedIn,isAuthenticated,getGym);
router.get("/photo-gym/:gymId",photoGym);
router.post("/block-gym-op/:userId/:gymId",isSignedIn,isAuthenticated,isAdmin,blockOpGym);
//authenticate gym account
router.get("/authenticate/gym/profile/:userId?",isSignedIn,isAuthenticated,isAdmin,authenticateGymProfile);
router.get("/get/total/lists/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,gettotalList);
//check gym status
router.get("/find-gym/status/:userId?",isSignedIn,isAuthenticated,checkGymStatus);

module.exports=router;