const express=require('express');
const router=express.Router();


const {getUserById}=require('../controllers/user');
const {isSignedIn,isInstaFitGymBranchAdmin,isAuthenticated}=require("../controllers/auth");
const {getBranchById}=require("../controllers/branch");
const {getPlannerById, getPlanner,getTotalPlannerPage,checkPlannerStatus, createPlanner, getAllPlanner, updatePlanner, assignPlannerToMember, deletePlanner, getAllPlanners}=require("../controllers/planner");
const {getMemberById}=require("../controllers/member");
const {getExerciseById,getExercise,addExercise,updateExercise,removeExercise, getAllExercises, getAllSelectedexercises, deleteAllSelectedExercise}=require("../controllers/exercise")

router.param("userId",getUserById);
router.param("branchId",getBranchById);
router.param("plannerId",getPlannerById);
router.param("memberId",getMemberById);
router.param("exerciseId",getExerciseById);

//Planner Routes
router.post("/branch-create-planner/:userId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,createPlanner);
router.put("/branch-update-planner/:userId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updatePlanner);
router.get("/branch-get-all-planner/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllPlanner);
router.get("/branch-get-planner/:userId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getPlanner);
router.post("/assign-planner-to-member/:userId/:memberId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,assignPlannerToMember);
router.get("/get-planner-page-total/:userId/:branchId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getTotalPlannerPage);
router.delete("/delete-planner/:userId/:branchId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,deletePlanner);

//add exercise
router.post("/add-planner-day-exercise/:userId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,addExercise);
router.put("/update-planner-day-exercise/:userId/:exerciseId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,updateExercise);
router.delete("/remove-planner-day-exercise/:userId/:plannerId/:exerciseId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,removeExercise);
router.get("/get-planner-day-all-exercises/:userId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllExercises);
router.get("/get-planner-day-exercise/:userId/:exerciseId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getExercise);
router.post("/get-all-selected-exercises/:userId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllSelectedexercises);
router.post("/delete-selected-exercises/:userId/:plannerId",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,deleteAllSelectedExercise);
//check status
router.get("/check-planner/status/:userId/:branchId?",isSignedIn,isAuthenticated,checkPlannerStatus);
router.get("/get/planners/:userId?",isSignedIn,isAuthenticated,isInstaFitGymBranchAdmin,getAllPlanners);

module.exports=router;