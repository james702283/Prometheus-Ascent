const express = require('express');
const router = express.Router();
const { getVerticals, getVerticalById } = require('../controllers/verticalController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getVerticals);
router.get('/:id', authMiddleware, getVerticalById);

module.exports = router;