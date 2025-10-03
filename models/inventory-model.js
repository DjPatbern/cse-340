const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1)";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("addClassification error: " + error);
    throw error;
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(invData) {
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
      inv_color,
    } = invData;

    const sql = `INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, classification_id, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;

    const vals = [
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_description || "",
      inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail || "/images/vehicles/no-image.png",
      inv_price || 0,
      inv_miles || 0,
      inv_color,
    ];

    return await pool.query(sql, vals);
  } catch (error) {
    console.error("addInventory error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
    throw error;
  }
}

/* ***************************
 *  Get a single inventory item by inv_id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inv_id]
    );
    return data.rows[0] || null;
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error);
    throw error;
  }
}

/* ***************************
 *  Edit inventory item
 * ************************** */
async function editInventory(invData) {
  try {
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    } = invData;

    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";

    const vals = [
      inv_make,
      inv_model,
      inv_description || "",
      inv_image || "/images/vehicles/no-image.png",
      inv_thumbnail || "/images/vehicles/no-image.png",
      inv_price || 0,
      inv_year,
      inv_miles || 0,
      inv_color,
      classification_id,
      inv_id,
    ];

    const data = await pool.query(sql, vals);
    return data.rows[0];
  } catch (error) {
    console.error("editInventory error: " + error);
    throw error;
  }
}

/* ***************************
 *  Delete inventory item
 * ************************** */
async function deleteInventory(invId) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [invId]);
    return data;
  } catch (error) {
    console.error("deleteInventory error: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  addClassification,
  addInventory,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  editInventory,
  deleteInventory,
};
