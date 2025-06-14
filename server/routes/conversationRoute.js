const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createConversation,
  getUserConversations,
  getConversationByRequest,
} = require("../controllers/conversationController");

router.post("/", auth, createConversation);
router.get("/", auth, getUserConversations);
router.get("/request/:requestId", auth, getConversationByRequest);

module.exports = router;