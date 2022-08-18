const express=require('express');
const router=express.Router();


const {getUserById}=require('../controllers/user');
const {isSignedIn,isInstaFitGymBranchAdmin,isAuthenticated}=require("../controllers/auth");
const {getBranchById}=require("../controllers/branch");
const {getNotification,getNotificationById,getAllBranchNotificationByBranch,getAllGymNotificationByBranch,createGymNotification,createBranchNotification,removeBranchNotification,removeGymNotification,updateNotification,getAllBranchAdminNotification,getAllMemberNotification,createBranchAdminNotification,createMemberNotification,removeBranchAdminNotification,removeMemberNotification}=require('../controllers/notification');
const {getGymById}=require('../controllers/gym')
const {getBranchAdminById}=require("../controllers/branchadmin");
const {getMemberById}=require("../controllers/member");


router.param("userId",getUserById);
router.param("branchId",getBranchById);
router.param("notificationId",getNotificationById);
router.param("gymId",getGymById);
router.param("branchadminId",getBranchAdminById);
router.param("memberId",getMemberById);


router.get("/user/notification/:userId/:notificationId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getNotification);
router.put("/user/update/notification/:userId/:notificationId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updateNotification);


router.get("/user/branch/notifications/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllBranchNotificationByBranch);
router.post("/user/branch/create/notification/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createBranchNotification);
router.delete("/user/branch/delete/notification/:userId/:notificationId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeBranchNotification);

router.get("/user/gym/notifications/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllGymNotificationByBranch);
router.post("/user/gym/create/notification/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createGymNotification);
router.delete("/user/gym/delete/notification/:userId/:notificationId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeGymNotification);

router.get("/user/branchadmin/notifications/:userId/:branchadminId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllBranchAdminNotification);
router.post("/user/branchadmin/create/notification/:userId/:branchadminId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createBranchAdminNotification);
router.delete("/user/branchadmin/delete/notification/:userId/:notificationId/:branchadminId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeBranchAdminNotification);

router.get("/user/member/notifications/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllMemberNotification);
router.post("/user/member/create/notification/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createMemberNotification);
router.delete("/user/member/delete/notification/:userId/:notificationId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeMemberNotification);

module.exports=router;