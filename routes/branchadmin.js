const express=require('express');
const router=express.Router();

const {getGymById}=require('../controllers/gym');
const {getUserById}=require('../controllers/user');
const {isSignedIn,isAdmin,isInstaFitGymAdmin,isInstaFitGymBranchAdmin,isAuthenticated}=require("../controllers/auth");
const {getBranchById, totalInActiveBranchs}=require("../controllers/branch");
const {getBranchAdminById,getBranchAdmin,getAllActiveBranchAdmin,getAllInActiveBranchAdmin,assignBranchAdmin,updateBranchAdmin,OPbranchAdminBlock, photoBranchAdmin, totalinactiveBranchAdminPage, totalactiveBranchAdminPage, checkBranchAdminStatus, getAllBranchAdminUsers}=require("../controllers/branchadmin");

router.param("userId",getUserById);
router.param("gymId",getGymById);
router.param("branchId",getBranchById);
router.param("branchadminId",getBranchAdminById);

router.get("/branchadmin-photo/:branchadminId",photoBranchAdmin);
router.post("/assign-branch-admin/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,assignBranchAdmin);
router.get("/get-branch-admin/:userId/:branchadminId",isSignedIn,isAuthenticated,getBranchAdmin);
router.get("/get-all-active-branchadmin/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllActiveBranchAdmin);
router.get("/get-all-inactive-branchadmin/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllInActiveBranchAdmin);
router.put("/update-branchadmin/:userId/:branchadminId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,updateBranchAdmin);
router.post("/active-inactive-operation-branchadmin/:userId/:branchadminId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,OPbranchAdminBlock);
router.get("/active-branchadmin-total-page/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalactiveBranchAdminPage);
router.get("/inactive-branchadmin-total-page/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalinactiveBranchAdminPage);
router.get("/check-branch-admin/status/:userId/:branchId?",isSignedIn,isAuthenticated,checkBranchAdminStatus);
router.get("/get/branchadmins/:userId?",isSignedIn,isAuthenticated,isAdmin,getAllBranchAdminUsers);

module.exports=router;