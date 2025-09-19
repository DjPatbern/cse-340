// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const util = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));

// Route to build a single inventory detail view 
router.get("/detail/:invId", util.handleErrors(invController.buildByInventoryId));

module.exports = router;
