const express = require('express');
const router = express.Router();

const {getUserById,getUser,getSelectedUser, updateUser}=require('../controllers/user');
const {isAdmin,isSignedIn,isAuthenticated, isInstaFitGymAdmin}=require("../controllers/auth");

router.param("userId",getUserById);

router.get("/get-user/:userId",isSignedIn,isAuthenticated,getUser);
router.post("/get-selected-user/:userId",isSignedIn,isAuthenticated,isInstaFitGymAdmin,getSelectedUser);
router.put("/update/user/profile/:userId",isSignedIn,isAuthenticated,updateUser);

module.exports = router;