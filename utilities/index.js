// utilities/index.js
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Build a single vehicle detail HTML block
 * - Uses full-size image (inv_image)
 * - Formats price as USD and mileage with commas
 * - Responsive structure for side-by-side on large screens and stacked on small screens
 **************************************** */
Util.buildVehicleDetail = async function(vehicle) {
  if (!vehicle) return '<p class="notice">No vehicle details available.</p>'

  const make = vehicle.inv_make || ''
  const model = vehicle.inv_model || ''
  const year = vehicle.inv_year || ''
  const price = vehicle.inv_price || 0
  const mileage = vehicle.inv_miles || 0
  const description = vehicle.inv_description || ''
  const classification = vehicle.classification_name || ''
  const image = vehicle.inv_image || vehicle.inv_thumbnail || ''

  const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
  const mileageFormatted = new Intl.NumberFormat('en-US').format(mileage)

  const html = `
    <section class="vehicle-detail">
      <div class="vehicle-detail__grid">
        <figure class="vehicle-detail__image">
          <img src="${image}" alt="${make} ${model} ${year}" />
        </figure>
        <div class="vehicle-detail__content">
          <h1 class="vehicle-title">${make} ${model} <span class="vehicle-year">(${year})</span></h1>
          <p class="vehicle-price">${priceFormatted}</p>
          <p class="vehicle-meta"><strong>Classification:</strong> ${classification} &nbsp; | &nbsp; <strong>Mileage:</strong> ${mileageFormatted} miles</p>
          <hr />
          <div class="vehicle-description">
            <h2>Vehicle Details</h2>
            <p>${description}</p>
          </div>
          <ul class="vehicle-specs">
            ${vehicle.inv_color ? `<li><strong>Color:</strong> ${vehicle.inv_color}</li>` : ''}
            ${vehicle.inv_engine ? `<li><strong>Engine:</strong> ${vehicle.inv_engine}</li>` : ''}
            ${vehicle.inv_transmission ? `<li><strong>Transmission:</strong> ${vehicle.inv_transmission}</li>` : ''}
            ${vehicle.inv_doors ? `<li><strong>Doors:</strong> ${vehicle.inv_doors}</li>` : ''}
          </ul>
        </div>
      </div>
    </section>
  `
  return html
}

/**
 * Build classification select list HTML
 */
Util.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += `>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/**
 * Simple server-side validation middleware for adding a classification
 * Ensures non-empty, no spaces/special chars
 */
Util.validateClassification = function(req, res, next) {
  const { classification_name } = req.body
  const errs = []
  if (!classification_name || classification_name.trim().length === 0) {
    errs.push("Classification name is required.")
  } else if (!/^[A-Za-z0-9_-]+$/.test(classification_name)) {
    errs.push("Classification may only contain letters, numbers, - and _. No spaces allowed.")
  }

  if (errs.length > 0) {
    (async () => {
      let nav = await module.exports.getNav ? await module.exports.getNav() : ""
      req.flash("message", "Please fix the errors.")
      return res.status(400).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: errs,
        classification_name,
        message: req.flash("message"),
      })
    })().catch(next)
    return
  }

  next()
}

/**
 * Simple server-side validation middleware for add inventory (checks required fields)
 */
Util.validateInventory = function(req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id,
    inv_miles,
    inv_color
  } = req.body

  const errs = []
  if (!inv_make || inv_make.trim() === "") errs.push("Make is required.")
  if (!inv_model || inv_model.trim() === "") errs.push("Model is required.")
  if (!inv_color || inv_color.trim() === "") errs.push("Color is required.")
  if (!inv_year || isNaN(Number(inv_year))) errs.push("Year is required and must be a number.")
  if (!inv_miles || isNaN(Number(inv_miles))) errs.push("Miles is required and must be a number.")
  if (!inv_price || isNaN(Number(inv_price))) errs.push("Price is required and must be a number.")
  if (!classification_id || classification_id === "") errs.push("Classification is required.")

  if (errs.length > 0) {
    (async () => {
      const classificationList = await buildClassificationList(req.body.classification_id || null)
      let nav = await module.exports.getNav ? await module.exports.getNav() : ""
      req.session.invSticky = req.body
      req.flash("message", "Please fix the errors below.")
      return res.status(400).render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: errs,
        inv: req.session.invSticky,
        message: req.flash("message"),
      })
    })().catch(next)
    return
  }
  next()
}


module.exports = Util
