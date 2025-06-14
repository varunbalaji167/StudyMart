const express = require("express");
const router = express.Router();
const { register, login, getMyProfile, updateMyProfile } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateMyProfile);

module.exports = router;
