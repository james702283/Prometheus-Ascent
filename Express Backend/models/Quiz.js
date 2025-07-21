const mongoose = require('mongoose');

/**
 * A sub-schema for individual questions within a quiz.
 * This enforces a consistent structure for all questions.
 */
const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: [true, 'Question text is required.'],
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: [
            {
                validator: function(arr) {
                    // Ensures there are at least 2 options.
                    return arr && arr.length >= 2;
                },
                message: 'A question must have at least 2 options.'
            },
            {
                validator: function(arr) {
                    // Ensures there are no duplicate options.
                    return new Set(arr).size === arr.length;
                },
                message: 'Options must be unique.'
            }
        ]
    },
    correctAnswer: {
        type: String,
        required: [true, 'A correct answer is required.'],
        // Validator to ensure the correct answer is one of the provided options.
        validate: {
            validator: function(value) {
                // 'this.options' refers to the options array in the same document.
                return this.options.includes(value);
            },
            message: 'Correct answer must be one of the provided options.'
        }
    },
    explanation: {
        type: String,
        required: [true, 'An explanation for the correct answer is required.'],
        trim: true
    }
}, { _id: false }); // _id is not needed for sub-documents in this case.

/**
 * The main schema for a Quiz.
 * Each document represents a unique, AI-generated or human-curated quiz for a specific skill.
 */
const quizSchema = new mongoose.Schema({
    vertical_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vertical', // Assumes a 'Vertical' model will exist.
        required: [true, 'A quiz must be associated with a vertical.'],
        index: true // Index for efficient querying of quizzes by vertical.
    },
    skill_id: {
        type: String, // Corresponds to a specific skill in the vertical's taxonomy.
        required: [true, 'A quiz must be associated with a skill.'],
        index: true // Index for fast lookups of quizzes by skill.
    },
    difficulty: {
        type: String,
        required: true,
        enum: {
            values: ['Easy', 'Medium', 'Hard'],
            message: 'Difficulty must be either Easy, Medium, or Hard.'
        },
        default: 'Medium'
    },
    questions: {
        type: [questionSchema],
        validate: {
            validator: function(arr) {
                return arr && arr.length > 0;
            },
            message: 'A quiz must have at least one question.'
        }
    },
    generatedBy: {
        type: String,
        enum: ['AI', 'Human'],
        default: 'AI'
    },
    // Aggregated feedback for quality analysis.
    feedback: {
        ratings: {
            type: [Number],
            default: []
        },
        averageRating: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields.
});

// Middleware to recalculate averageRating before saving.
// This is more efficient than calculating it on the fly every time it's needed.
quizSchema.pre('save', function(next) {
    if (this.isModified('feedback.ratings')) {
        const ratings = this.feedback.ratings;
        if (ratings && ratings.length > 0) {
            const sum = ratings.reduce((acc, rating) => acc + rating, 0);
            this.feedback.averageRating = parseFloat((sum / ratings.length).toFixed(2));
        } else {
            this.feedback.averageRating = 0;
        }
    }
    next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;