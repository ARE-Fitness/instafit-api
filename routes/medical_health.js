const express=require('express');
const router=express.Router();

const {getUserById}=require('../controllers/user');
const {isSignedIn,isAdmin,isInstaFitGymAdmin,isInstaFitGymBranchAdmin, isAuthenticated}=require("../controllers/auth");
const {getMedicalHealthById,getMedicalHealth,updateMedicalHealth}=require('../controllers/medical_health')


router.param("userId",getUserById);
router.param("medicalhealthId",getMedicalHealthById);

router.get(`/medical/health/:userId/:medicalhealthId`,isSignedIn,isAuthenticated,getMedicalHealth);
router.put(`/update/medical/health/:userId/:medicalhealthId`,isSignedIn,isAuthenticated,updateMedicalHealth)


module.exports=router;