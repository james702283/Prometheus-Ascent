const Profile = require('../models/Profile');

// @desc    Get user profile and assessments
// @route   GET /api/profiles
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('assessments.vertical', 'name');

        if (!profile) {
            return res.json({
                user: { id: req.user.id },
                assessments: {}
            });
        }
        res.json({
            user: { id: req.user.id },
            assessments: profile.assessments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile.', error: error.message });
    }
};

// @desc    Create or update a skill assessment
// @route   POST /api/profiles/assessment
// @access  Private
const saveAssessment = async (req, res) => {
    try {
        const { verticalId, skills } = req.body;
        const userId = req.user.id;

        let profile = await Profile.findOne({ user: userId });

        if (!profile) {
            profile = new Profile({ user: userId, assessments: new Map() });
        }

        profile.assessments.set(verticalId, {
            vertical: verticalId,
            skills: skills,
            lastUpdated: new Date()
        });

        // ** THE FIX IS HERE: **
        // Explicitly mark the 'assessments' Map as modified before saving.
        profile.markModified('assessments');

        await profile.save();
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error saving assessment:", error);
        res.status(500).json({ message: 'Server error saving assessment.' });
    }
};

module.exports = {
    getUserProfile,
    saveAssessment,
};