const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  // Defensive: ensure data exists
  const className = data[0] ? data[0].classification_name : "Inventory";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single inventory item detail view
 *  - uses invId from URL
 *  - Task 1 requirement
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getInventoryByInventoryId(inv_id)

  if (!vehicle) {
    let nav = await utilities.getNav()
    return res.status(404).render("./inventory/not-found", {
      title: "Vehicle not found",
      nav,
      message: "Sorry, we couldn't find the vehicle you requested."
    })
  }

  // Build markup HTML for the vehicle detail
  const vehicleDetailHTML = await utilities.buildVehicleDetail(vehicle)
  const nav = await utilities.getNav()
  const pageTitle = `${vehicle.inv_make} ${vehicle.inv_model} - ${vehicle.inv_year}`

  res.render("./inventory/detail", {
    title: pageTitle,
    nav,
    vehicleDetailHTML,
    vehicle
  })
}

module.exports = invCont
