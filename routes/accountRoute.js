// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const util = require("../utilities/")

// Route to build login view
router.get("/login", util.handleErrors(accountController.buildLogin));

// Route to build register view
router.get("/register", util.handleErrors(accountController.buildRegister));

//Route to register new user
router.post('/register', util.handleErrors(accountController.registerAccount))




module.exports = router;
