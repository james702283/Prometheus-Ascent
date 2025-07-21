const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz } = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

// Note the path change for generate-quiz to be more RESTful
router.post('/generate', authMiddleware, generateQuiz);
router.post('/submit', authMiddleware, submitQuiz);

module.exports = router;