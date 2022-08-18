const express=require('express');
const router=express.Router();

const {getGymById}=require('../controllers/gym');
const {getUserById}=require('../controllers/user');
const {isSignedIn,isInstaFitGymBranchAdmin,isAuthenticated, isInstaFitGymAdmin}=require("../controllers/auth");
const {getBranchById}=require("../controllers/branch");
const {getMemberById,getMember,getAllMember,totalPageActiveMember,totalPageInActiveMember,createMember,OPblockMember,getAllActiveMembersByBranch,updateMember,getAllInActiveMembersByBranch,getMemberPhoto, getAllMembersOfGymBranchs, checkMemberStatus}=require("../controllers/member");
const {getMemberMeasureMentById,getMemberMeasurement,getAllMemberMeasurememt,takeMeasureMentForMember, updateMeasurerment, removeMeasurement, totalPageMemberMeasurement}=require("../controllers/measurement");
const {getMemberFitnessTestById,getMemberFitnessTest,getAllMemberFitnessTest,takeFitnessTestForMember, updateFitnessTest, removeFitnessTest, totalPageMemberFitnessTest}=require("../controllers/fitnesstest");
 const {getAllMemberPhyBodyCompTest,getMemberPhyBodyCompTestById,getMemberPhyBodyCompTest,takePhyBodyCompTestForMember, updatePhyBodyCompTest, removePhyBodyCompTest, totalPageMemberPhyBodyCompTest}=require("../controllers/phy_bodycomp_test");
const {getPlannerHistory,getPlannerHistoryById,getAllPlannerHistoryByMember,totalPlannerHistoryAndPage}=require("../controllers/plannerhistory");
const {getAllDailyExerciseEventsByCalender,getCalender,getCalenderById}=require("../controllers/calender");
const {getDailyExerciseEventById,getDailyExerciseEvent}=require("../controllers/daily_ex_event");
const {getMedicalReportById,getMedicalReport,getMedicalReportFile,addMedicalReport,getAllMedicalReport}=require("../controllers/medical_report");

//user,gym,branch,member,measurement,body composition and fitness test,planner history,calender,daily exercise event params
router.param("userId",getUserById);
router.param("gymId",getGymById);
router.param("branchId",getBranchById);
router.param("memberId",getMemberById);
router.param("measurementtestId",getMemberMeasureMentById);
router.param("fitnesstestId",getMemberFitnessTestById);
router.param("phybodycompId",getMemberPhyBodyCompTestById);
router.param("plannerhistoryId",getPlannerHistoryById);
router.param("calenderId",getCalenderById);
router.param("dailexerciseeventId",getDailyExerciseEventById);
router.param("medicalreportId",getMedicalReportById);


//member crud operations
router.get("/get-member/:userId/:memberId",isSignedIn,isAuthenticated,getMember);
router.get("/get-member-photo/:memberId",getMemberPhoto);
router.get("/get-all-member-active/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllActiveMembersByBranch);
router.get("/get-all-member-inactive/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllInActiveMembersByBranch);
router.get("/total-page-member-active/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalPageActiveMember);
router.get("/total-page-member-inactive/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalPageInActiveMember);
router.post("/create-member/:userId/:branchId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createMember);
router.put("/update-member/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updateMember);
router.post("/active-inactive-operation-member/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,OPblockMember);
router.post("/get/all/members/branhs/gym/:userId/:gymId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllMembersOfGymBranchs);
// //measurement test 
router.get("/get-measurement-test-by-member/:userId/:measurementtestId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getMemberMeasurement);
router.get("/get-all-measurement-test-by-member/:userId/:memberId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllMemberMeasurememt);
router.post("/take-member-measurement-test/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,takeMeasureMentForMember);
router.put("/update-member-measurement-test/:userId/:measurementtestId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updateMeasurerment);
router.delete("/delete-member-measurement-test/:userId/:memberId/:measurementtestId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeMeasurement);
router.get("/get-member-total-page-measurement-test/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalPageMemberMeasurement);
// //fitness test 
router.get("/get-fitness-test-by-member/:userId/:fitnesstestId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getMemberFitnessTest);
router.get("/get-all-fitness-test-by-member/:userId/:memberId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllMemberFitnessTest);
router.post("/take-member-fitness-test/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,takeFitnessTestForMember);
router.put("/update-member-fitness-test/:userId/:fitnesstestId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updateFitnessTest);
router.delete("/delete-member-fitness-test/:userId/:memberId/:fitnesstestId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeFitnessTest);
router.get("/get-member-total-page-fitness-test/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalPageMemberFitnessTest);
// //body composition test
router.get("/get-bodycomposition-test-by-member/:userId/:phybodycompId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getMemberPhyBodyCompTest);
router.get("/get-all-bodycompostion-test-by-member/:userId/:memberId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getMemberPhyBodyCompTest);
router.post("/take-member-bodycomposition-test/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,takePhyBodyCompTestForMember);
router.put("/update-member-bodycomptest/:userId/:phybodycompId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updatePhyBodyCompTest);
router.delete("/delete-member-bodycomposition-test/:userId/:memberId/:phybodycompId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removePhyBodyCompTest);
router.get("/get-member-total-page-bodycomposition-test/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalPageMemberPhyBodyCompTest);
//planner history
router.get("/get-member-planner-history/:userId/:plannerhistoryId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getPlannerHistory);
router.get("/get-member-all-planner-history/:userId/:memberId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllPlannerHistoryByMember);
router.get("/get-member-total-pages/planner-history/:userId/:memberId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,totalPlannerHistoryAndPage);


//calender & dailyexercise
router.get("/get-calender/:userId/:calenderId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getCalender);
router.get("/get-all-dailyexerciseevent-calender/:userId/:calenderId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllDailyExerciseEventsByCalender);
router.get("/get-dailyexerciseevent/:userId/:dailexerciseeventId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getDailyExerciseEvent);
//medical reprts
router.get("/get-medical-report/:userId/:medicaklreportId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getMedicalReport);
router.get("/get-medical-report-file/:medicalreportId",getMedicalReportFile);
router.get("/get-all-medical-report/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllMedicalReport)
router.post("/add-medical-report/:userId/:memberId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,addMedicalReport);
//check status
router.get("/check-member/status/:userId?",isSignedIn,isAuthenticated,checkMemberStatus);
//
router.get("/get/members/:userId?",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getAllMember);






module.exports=router;