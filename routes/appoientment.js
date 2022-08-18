const express = require('express');
const router=express.Router();
//My Routes
const {getMemberById}=require('../controllers/member');
const {isSignedIn,isAuthenticated,isInstaFitGymAdmin,isInstaFitGymBranchAdmin,isAdmin}=require('../controllers/auth');
const {getBranchById}=require('../controllers/branch');
const {getAppoientmentById,getAllAppoientmentByMember,getAllAppoientment,getAppoientment,createAppoientment,updateAppoientment}=require('../controllers/appoientment');
const {getUserById}=require('../controllers/user')

//params
router.param('userId',getUserById);
router.param('memberId',getMemberById);
router.param('appoientmentId',getAppoientmentById);
router.param('branchId',getBranchById);

router.get(`/user/appoientment/:userId/:appoientmentId`,isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAppoientment);
router.get(`/user/appoientments/:userId/:branchId`,isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllAppoientment);
router.get(`/user/appoientments/by-member/:userId/:memberId`,isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllAppoientmentByMember);
router.get(`/user/appoientments/by-member/:userId/:memberId`,isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllAppoientmentByMember);
router.put(`/user/update/appoientment/:userId/:appoientmentId`,isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updateAppoientment);
router.post(`/user/create/appoientment/:userId/:memberId`,isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createAppoientment);


module.exports=router;