const express = require('express');
const router=express.Router();
//My Routes
const {SignUp,SignIn,SignOut, authenticateEmail, accountActivation}=require("../controllers/auth");


// Users routes
router.post("/signup",SignUp);
router.post("/signin",SignIn);
router.get("/signout",SignOut);
router.get("/account-activation?",accountActivation);
router.get("/authenticat/email?",authenticateEmail);

module.exports=router;