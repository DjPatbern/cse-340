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

module.exports = Util
