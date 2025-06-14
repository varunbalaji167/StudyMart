const express = require("express");
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  deleteItem,
} = require("../controllers/itemController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createItem);

router.get("/", getItems);
router.get("/:id", getItemById);

router.delete("/:id", auth, deleteItem);

module.exports = router;
