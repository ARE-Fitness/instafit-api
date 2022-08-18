const express=require('express');
const router=express.Router();


//user,gym,test and branch controllers...........................
const {getUserById}=require('../controllers/user');
const {isSignedIn,isAdmin,isInstaFitGymAdmin,isInstaFitGymBranchAdmin,isAuthenticated}=require("../controllers/auth");
const {getBranchById}=require("../controllers/branch");
const {getTestById,getTest,AddTestToBranch,AddTestToGym,totalBranchPageTest,totalGymPageTest,removeTestFromBranch,removeTestFromGym,getAllFitnessTestByBranch,getAllFitnessTestByGym,getAllMeasurementTestByBranch,getAllMeasurementTestByGym}=require("../controllers/test");
const {getGymById}=require("../controllers/gym");

//user,test and branch params
router.param("userId",getUserById);
router.param("branchId",getBranchById);
router.param("testId",getTestById);
router.param("gymId",getGymById);

//GET test
router.get("/get-test/:userId/:testId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getTest);
//GYM
router.get("/get-all-measurement-test-by-gym/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllMeasurementTestByGym);
router.get("/get-all-fitness-test-by-gym/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllFitnessTestByGym);
router.post("/add-test-to-gym/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,AddTestToGym);
router.delete("/remove-test-from-gym/:userId/:gymId/:testId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,removeTestFromGym);
router.get("/total-page-test-of-gym/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,totalGymPageTest);

//BRANCH
router.get("/get-all-measurement-test-by-branch/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllMeasurementTestByBranch);
router.get("/get-all-fitness-test-by-branch/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllFitnessTestByBranch);
router.post("/add-test-to-branch/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,AddTestToBranch);
router.delete("/remove-test-from-branch/:userId/:branchId/:testId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeTestFromBranch);
router.get("/total-page-test-of-branch/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalBranchPageTest);

module.exports=router;