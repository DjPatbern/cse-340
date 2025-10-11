const interactionModel = require("../models/interaction-model");

const interactionController = {};

// Toggle like
interactionController.toggleLike = async (req, res) => {
  const account_id = res.locals.accountData.account_id;
  const { inv_id } = req.body;

  try {
    const result = await interactionModel.toggleLike(account_id, inv_id);
    const likeCount = await interactionModel.getLikeCount(inv_id);
    res.json({ success: true, ...result, likeCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get comments
interactionController.getComments = async (req, res) => {
  const { inv_id } = req.params;
  try {
    const comments = await interactionModel.getComments(inv_id);
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add comment
interactionController.addComment = async (req, res) => {
  const account_id = res.locals.accountData.account_id;
  const { inv_id, content } = req.body;

  try {
    const comment = await interactionModel.addComment(account_id, inv_id, content);
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update comment
interactionController.updateComment = async (req, res) => {
  const account_id = res.locals.accountData.account_id;
  const { comment_id, content } = req.body;

  try {
    const updated = await interactionModel.updateComment(comment_id, content, account_id);
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete comment
interactionController.deleteComment = async (req, res) => {
  const account_id = res.locals.accountData.account_id;
  const { comment_id } = req.body;

  try {
    await interactionModel.deleteComment(comment_id, account_id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = interactionController;
