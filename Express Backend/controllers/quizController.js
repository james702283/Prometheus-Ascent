const path = require('path');
const Quiz = require(path.join(__dirname, '..', 'models', 'Quiz.js'));
const QuizAttempt = require(path.join(__dirname, '..', 'models', 'QuizAttempt.js'));
const Vertical = require(path.join(__dirname, '..', 'models', 'Vertical.js'));
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// @desc    Generate a quiz using AI
// @route   POST /api/quizzes/generate
// @access  Private
const generateQuiz = async (req, res) => {
    try {
        const { verticalId, skill } = req.body;
        const vertical = await Vertical.findById(verticalId);
        if (!vertical) return res.status(404).json({ message: "Vertical not found." });

        const promptText = `You are an expert curriculum designer for the ${vertical.name} industry. Generate a 5-question multiple-choice quiz to assess foundational knowledge for the skill "${skill}". For each question, provide a brief but clear explanation for why the correct answer is right. Return the response ONLY as a valid JSON object with the following structure: { "questions": [ { "questionText": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "...", "explanation": "..." } ] }. Do not include any other text, markdown, or explanations outside of the JSON object.`;

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

        const payload = { contents: [{ parts: [{ text: promptText }] }] };
        const geminiResponse = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error("Gemini API Error:", errorBody);
            throw new Error('Failed to generate quiz from AI service.');
        }

        const geminiResult = await geminiResponse.json();
        const rawText = geminiResult.candidates[0].content.parts[0].text;
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const quizData = JSON.parse(cleanedText);

        const newQuiz = new Quiz({
            vertical_id: verticalId,
            skill_id: skill,
            questions: quizData.questions,
        });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error("Quiz generation error:", error);
        res.status(500).json({ message: "Server error during quiz generation." });
    }
};

// @desc    Submit a quiz and record the attempt
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found." });

        if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
            return res.status(400).json({ message: "Invalid answers format or length." });
        }

        let score = 0;
        const detailedResults = [];

        quiz.questions.forEach((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) score++;
            
            detailedResults.push({
                // ** THE FIX IS HERE: **
                // Add the 'questionIndex' to satisfy the schema validation.
                questionIndex: index,
                question_id: question._id,
                selectedAnswer: userAnswer || "Not answered",
                isCorrect: isCorrect,
                questionText: question.questionText,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            });
        });

        const finalScore = (score / quiz.questions.length) * 100;

        const attempt = new QuizAttempt({
            quiz_id: quizId,
            user_id: req.user.id,
            answers: detailedResults,
            score: finalScore,
        });
        await attempt.save();

        res.status(200).json({
            score: finalScore,
            results: detailedResults.map(r => ({
                isCorrect: r.isCorrect,
                userAnswer: r.selectedAnswer,
                correctAnswer: r.correctAnswer,
                questionText: r.questionText,
                explanation: r.explanation
            })),
            skill: quiz.skill_id
        });
    } catch (error) {
        console.error("Quiz submission error:", error);
        res.status(500).json({ message: "Server error during quiz submission." });
    }
};

module.exports = {
    generateQuiz,
    submitQuiz,
};