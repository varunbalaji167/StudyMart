const express = require('express');
const { createRating, getUserRatings } = require('../controllers/ratingController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createRating);
router.get('/:userId', getUserRatings);

module.exports = router;