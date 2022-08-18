const express=require('express');
const router=express.Router();

const {getGymById}=require('../controllers/gym');
const {getUserById}=require('../controllers/user');
const {isSignedIn,isAdmin,isInstaFitGymAdmin,isInstaFitGymBranchAdmin,isAuthenticated}=require("../controllers/auth");
const {getBranchById,getBranch,getAllActiveBranch,getAllInActiveBranch,getBranchByUser,blockOPBranch,createBranch,updateBranch,totalActiveBranchs,totalInActiveBranchs, checkBranchStatus, getAllBranch}=require("../controllers/branch");


router.param("userId",getUserById);
router.param("gymId",getGymById);
router.param("branchId",getBranchById);

router.get("/get-branch/:userId/:branchId",isSignedIn,isAuthenticated,getBranch);
router.get("/get-branch-by-user/:userId",isSignedIn,isAuthenticated,getBranchByUser);
router.post("/create-branch/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,createBranch);
router.put("/update-branch/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,updateBranch);
router.get("/get-all-active-branch/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllActiveBranch);
router.get("/get-all-inactive-branch/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllInActiveBranch);
router.get("/total-page-active-branch/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,totalActiveBranchs);
router.get("/total-page-inactive-branch/:userId/:gymId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,totalInActiveBranchs);
router.post("/block-op-branch/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,blockOPBranch);
router.get("/find-branch/status/:userId/:gymId?",isSignedIn,isAuthenticated,checkBranchStatus);

//get all
router.get(`/get/branchs/:userId?`,isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllBranch);


module.exports=router;
