// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const util = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Route to build login view
router.get(
  "/login",
  regValidate.loginRules(),
  util.handleErrors(accountController.buildLogin)
);

// Route to build register view
router.get("/register", util.handleErrors(accountController.buildRegister));

// Route to build account management view
router.get("/", util.checkLogin, util.handleErrors(accountController.buildAccountManagement));

//Route to register new user
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  util.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  util.handleErrors(accountController.accountLogin)
);

module.exports = router;
