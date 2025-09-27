const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities/")

router.get("/", util.handleErrors(invController.buildManagement));

router.get("/add-classification", util.handleErrors(invController.buildAddClassification))
router.post("/add-classification", util.handleErrors(util.validateClassification), util.handleErrors(invController.handleAddClassification))

router.get("/add-inventory", util.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", util.handleErrors(util.validateInventory), util.handleErrors(invController.handleAddInventory))

router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));

router.get("/detail/:invId", util.handleErrors(invController.buildByInventoryId));

module.exports = router;
