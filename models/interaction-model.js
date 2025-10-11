const pool = require("../database/");

const interactionModel = {};

/* ---------- LIKES ---------- */

// Toggle like (like if not exists, unlike if exists)
interactionModel.toggleLike = async (account_id, inv_id) => {
  try {
    const check = await pool.query(
      "SELECT * FROM likes WHERE account_id = $1 AND inv_id = $2",
      [account_id, inv_id]
    );

    if (check.rowCount > 0) {
      await pool.query("DELETE FROM likes WHERE account_id = $1 AND inv_id = $2", [account_id, inv_id]);
      return { liked: false };
    } else {
      await pool.query("INSERT INTO likes (account_id, inv_id) VALUES ($1, $2)", [account_id, inv_id]);
      return { liked: true };
    }
  } catch (error) {
    console.error("toggleLike error:", error);
    throw error;
  }
};

// Count likes for an inventory item
interactionModel.getLikeCount = async (inv_id) => {
  const data = await pool.query("SELECT COUNT(*) FROM likes WHERE inv_id = $1", [inv_id]);
  return parseInt(data.rows[0].count);
};

// Check if a user liked this item
interactionModel.userLiked = async (account_id, inv_id) => {
  const data = await pool.query("SELECT * FROM likes WHERE account_id = $1 AND inv_id = $2", [account_id, inv_id]);
  return data.rowCount > 0;
};

/* ---------- COMMENTS ---------- */

// Add new comment
interactionModel.addComment = async (account_id, inv_id, content) => {
  const sql = `
    INSERT INTO comments (account_id, inv_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const data = await pool.query(sql, [account_id, inv_id, content]);
  return data.rows[0];
};

// Get comments for an inventory item
interactionModel.getComments = async (inv_id) => {
  const sql = `
    SELECT c.*, a.account_firstname, a.account_lastname
    FROM comments c
    JOIN account a ON c.account_id = a.account_id
    WHERE c.inv_id = $1
    ORDER BY c.created_at DESC;
  `;
  const data = await pool.query(sql, [inv_id]);
  return data.rows;
};

// Update comment
interactionModel.updateComment = async (comment_id, content, account_id) => {
  const sql = `
    UPDATE comments
    SET content = $1, updated_at = CURRENT_TIMESTAMP
    WHERE comment_id = $2 AND account_id = $3
    RETURNING *;
  `;
  const data = await pool.query(sql, [content, comment_id, account_id]);
  return data.rows[0];
};

// Delete comment
interactionModel.deleteComment = async (comment_id, account_id) => {
  const sql = `DELETE FROM comments WHERE comment_id = $1 AND account_id = $2`;
  await pool.query(sql, [comment_id, account_id]);
  return true;
};

module.exports = interactionModel;
