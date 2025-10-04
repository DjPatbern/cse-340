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
router.get(
  "/",
  util.checkLogin,
  util.handleErrors(accountController.buildAccountManagement)
);

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

// Update Account View
router.get(
  "/update/:account_id",
  util.checkLogin,
  util.handleErrors(accountController.buildUpdateAccount)
);

// Process account update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  util.handleErrors(accountController.updateAccount)
);

// Process password update
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  util.handleErrors(accountController.updatePassword)
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  res.redirect("/")
})


module.exports = router;
