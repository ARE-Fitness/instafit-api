const express = require('express');
const router = express.Router();

const {getUserById}=require('../controllers/user');
const {isSignedIn,isAuthenticated, isInstaFitGymBranchAdmin}=require("../controllers/auth");
const {getWorkOutReportById,sortReportsByDate,getWorkoutReport,getAllMemberWorkOutReports,addWorkoutReport,updateMemberWorkOutRerport, totalWorkOutReportPagesnDocsOfMember, findWorkOutReport, getSelectedWorkoutReport}=require('../controllers/workout_report');
const {getMemberById}=require('../controllers/member') 

router.param("userId",getUserById);
router.param("workoutreportId",getWorkOutReportById);
router.param('memberId',getMemberById);

router.get('/user/all/workout-report/:userId/:memberId?',isSignedIn,isAuthenticated,getAllMemberWorkOutReports)
router.get('/user/workout-report/total/pages/:userId/:memberId?',isSignedIn,isAuthenticated,totalWorkOutReportPagesnDocsOfMember);
router.get('/user/workout-report/:userId/:workoutreportId',isSignedIn,isAuthenticated,getWorkoutReport);
router.post('/add/workout-report/:userId/:memberId?',isSignedIn,isAuthenticated,addWorkoutReport);
router.put('/edit/workout-report/:userId/:workoutreportId',isSignedIn,isAuthenticated,updateMemberWorkOutRerport);
router.post("/find-workout-report/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,findWorkOutReport);
router.post("/selected-workout-report/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getSelectedWorkoutReport);
router.post("/get-all/reports-by/dates:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,sortReportsByDate)

module.exports = router;