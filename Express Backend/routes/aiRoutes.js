const express = require('express');
const router = express.Router();
const path = require('path');
const { analyzeAssessment } = require(path.join(__dirname, '..', 'controllers', 'aiController.js'));
const authMiddleware = require(path.join(__dirname, '..', 'middleware', 'authMiddleware.js'));

// The route is POST because it requires a body (verticalId) to be sent.
router.post('/analyze', authMiddleware, analyzeAssessment);

module.exports = router;