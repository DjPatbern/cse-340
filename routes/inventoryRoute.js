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

router.get("/getInventory/:classification_id", util.handleErrors(invController.getInventoryJSON))

router.get("/edit/:invId", util.handleErrors(invController.buildEditInventory));

router.post("/update/", util.handleErrors(util.validateEditInventory),  util.handleErrors(invController.handleEditInventory))

router.get("/delete/:invId", util.handleErrors(invController.buildDeleteInventory));

router.post("/delete/",  util.handleErrors(invController.handleDeleteInventory))


module.exports = router;
