const express = require('express');
const {
  createRequest,
  getIncomingRequests,
  updateRequestStatus,
  getOutgoingRequests,
} = require('../controllers/requestController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createRequest);
router.get('/incoming', auth, getIncomingRequests);
router.get('/outgoing', auth, getOutgoingRequests); 
router.put('/:requestId', auth, updateRequestStatus);

module.exports = router;