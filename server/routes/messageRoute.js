const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.post("/", auth, sendMessage);
router.get("/:conversationId", auth, getMessages);

module.exports = router;