const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const util = require("../utilities/")

// Route to intentionally trigger a server error 
router.get("/trigger", util.handleErrors(errorController.triggerError))

module.exports = router
