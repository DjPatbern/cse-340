const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Management view
 *  - route: GET /inv/
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("message"),
  })
}

/* ***************************
 *  Add classification view 
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
    message: req.flash("message"),
  })
}

/* ***************************
 *  Handle Add classification 
 * ************************** */
invCont.handleAddClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body

    if (!classification_name || !classification_name.match(/^[A-Za-z0-9_-]+$/)) {
      let nav = await utilities.getNav()
      req.flash("message", "Invalid classification name. Use only letters, numbers, - or _ (no spaces).")
      return res.status(400).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: ["Invalid classification name."],
        classification_name,
        message: req.flash("message"),
      })
    }

    const result = await invModel.addClassification(classification_name)

    if (result && result.rowCount > 0) {
      let nav = await utilities.getNav()
      req.flash("message", `Classification "${classification_name}" added successfully.`)
      return res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("message"),
      })
    } else {
      let nav = await utilities.getNav()
      req.flash("message", "Failed to add classification. Please try again.")
      return res.status(500).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: ["Failed to add classification."],
        classification_name,
        message: req.flash("message"),
      })
    }
  } catch (error) {
    return next(error)
  }
}

/* ***************************
 *  Add inventory view 
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const sticky = req.session?.invSticky || {}

    const classificationList = await utilities.buildClassificationList(sticky.classification_id || null)
    const nav = await utilities.getNav()

    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv: sticky,
      message: req.flash("message"),
    })
  } catch (error) {
    return next(error)
  }
}

/* ***************************
 *  Handle Add inventory 
 * ************************** */
invCont.handleAddInventory = async function (req, res, next) {
  try {
    const {
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body

    req.session.invSticky = { inv_make, inv_model, inv_year, classification_id, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color }

    const errors = []
    if (!inv_make) errors.push("Make is required.")
    if (!inv_model) errors.push("Model is required.")
    if (!inv_color) errors.push("Color is required.")
    if (!inv_year || isNaN(Number(inv_year))) errors.push("Year is required and must be a number.")
    if (!inv_price || isNaN(Number(inv_price))) errors.push("Price is required and must be a number.")
    if (!inv_miles || isNaN(Number(inv_miles))) errors.push("Miles is required and must be a number.")
    if (!classification_id) errors.push("Classification is required.")

    if (errors.length > 0) {
      const classificationList = await utilities.buildClassificationList(classification_id || null)
      const nav = await utilities.getNav()
      req.flash("message", "Please fix the errors below.")
      return res.status(400).render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors,
        inv: req.session.invSticky,
        message: req.flash("message"),
      })
    }

    const result = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })

    if (result && result.rowCount > 0) {
      req.session.invSticky = null

      const nav = await utilities.getNav()
      req.flash("message", `${inv_make} ${inv_model} added successfully.`)
      return res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("message"),
      })
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id || null)
      const nav = await utilities.getNav()
      req.flash("message", "Failed to add inventory item. Please try again.")
      return res.status(500).render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: ["Failed to add inventory item."],
        inv: req.session.invSticky,
        message: req.flash("message"),
      })
    }
  } catch (error) {
    return next(error)
  }
}

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
