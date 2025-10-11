const express = require("express");
const router = new express.Router();
const interactionController = require("../controllers/interactionController");
const utilities = require("../utilities/");

// Likes
router.post("/like", utilities.checkLogin, interactionController.toggleLike);

// Comments
router.get(
  "/:inv_id/comments",
  utilities.handleErrors(interactionController.getComments)
);
router.post(
  "/comment",
  utilities.checkLogin,
  utilities.handleErrors(interactionController.addComment)
);
router.put(
  "/comment",
  utilities.checkLogin,
  utilities.handleErrors(interactionController.updateComment)
);
router.delete(
  "/comment",
  utilities.checkLogin,
  utilities.handleErrors(interactionController.deleteComment)
);

module.exports = router;
