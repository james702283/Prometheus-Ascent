const express = require('express');
const router = express.Router();
const { getUserProfile, saveAssessment } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserProfile);
router.post('/assessment', authMiddleware, saveAssessment);

module.exports = router;