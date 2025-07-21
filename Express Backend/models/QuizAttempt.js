const mongoose = require('mongoose');

/**
 * A sub-schema to store the user's answer for a single question.
 */
const answerSchema = new mongoose.Schema({
    questionIndex: {
        type: Number,
        required: [true, 'Question index is required.']
    },
    selectedAnswer: {
        type: String,
        required: [true, 'A selected answer is required.']
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
}, { _id: false });

/**
 * The main schema for a Quiz Attempt.
 * Each document represents a single, completed attempt by a user for a specific quiz.
 */
const quizAttemptSchema = new mongoose.Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: [true, 'A quiz attempt must reference a quiz.'],
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes a 'User' model will exist.
        required: [true, 'A quiz attempt must belong to a user.'],
        index: true
    },
    answers: {
        type: [answerSchema],
        default: []
    },
    score: {
        type: Number,
        required: [true, 'A final score is required.'],
        min: [0, 'Score cannot be less than 0.'],
        max: [100, 'Score cannot be greater than 100.']
    },
    timeTaken: {
        type: Number, // Stored in seconds.
        min: [0, 'Time taken cannot be negative.']
    },
    // Specific feedback for this single attempt.
    feedback: {
        rating: {
            type: Number,
            min: [1, 'Rating must be at least 1.'],
            max: [5, 'Rating must be no more than 5.']
        },
        comment: {
            type: String,
            trim: true,
            maxLength: [500, 'Feedback comment cannot exceed 500 characters.']
        }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields.
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt;