const express=require('express');
const router=express.Router();

const {getGymById}=require('../controllers/gym');
const {getUserById,getUser}=require('../controllers/user');
const {isSignedIn,isInstaFitGymAdmin,isInstaFitGymBranchAdmin,isAuthenticated, isAdmin}=require("../controllers/auth");
const {getContentById,getContent,createContent,updateContent,getAllActiveContentByGym,blockOpContent,getAllContents,checkContentStatus,getAllInActiveContentByGym, getAllInActiveWarmUpExercise, getAllActiveWarmUpExercise, getAllActiveMainExercise, getAllInActiveMainExercise,getAllInActiveCoolDownExercise,getAllActiveCoolDownExercise, getAllSelectedContents, getAllInActiveFitnessContent,getAllActiveFitnessContent, getPageTotalContent}=require("../controllers/content");

router.param("userId",getUserById);
router.param("gymId",getGymById);
router.param("contentId",getContentById);


//instafit admin
router.post("/user-gym-content-create/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,createContent);
router.put("/user-gym-content-update/:userId/:contentId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,updateContent);
router.get("/user-gym-get-content/:userId/:contentId",isSignedIn,isAuthenticated,getContent);
router.get("/user-gym-get-all-active-contents/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllActiveContentByGym);
router.get("/user-gym-get-all-inactive-contents/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllInActiveContentByGym);
router.post("/block-content-op/:userId/:contentId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,blockOpContent);
router.get("/get-all-active-warmups-by-gym/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllActiveWarmUpExercise);
router.get("/get-all-inactive-warmups-by-gym/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllInActiveWarmUpExercise);
router.get("/get-all-active-mainex-by-gym/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllActiveMainExercise);
router.get("/get-all-inactive-mainex-by-game/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllInActiveMainExercise);
router.get("/get-all-active-cooldown-by-game/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllActiveCoolDownExercise);
router.get("/get-all-inactive-cooldown-by-game/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllInActiveCoolDownExercise);
router.post("/get-all-selected-contents/:userId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllSelectedContents);
router.get(`/get-all-active/fitness-contents/:userId/:gymId?`,isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllActiveFitnessContent);
router.get('/get-all-inactive/fitness-contents/:userId/:gymId?',isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllInActiveFitnessContent);
router.get('/total/page-contents/:userId/:gymId?',isSignedIn,isAuthenticated,isInstaFitGymAdmin,getPageTotalContent);
//check status
router.get("/check-content/status/:userId/:gymId?",isSignedIn,isAuthenticated,checkContentStatus);
//get all
router.get("/get/contents/:userId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllContents);


module.exports=router;