const Vertical = require('../models/Vertical');

// @desc    Get all verticals
// @route   GET /api/verticals
// @access  Private
const getVerticals = async (req, res) => {
    try {
        const verticals = await Vertical.find({}, 'name description');
        res.json(verticals);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching verticals." });
    }
};

// @desc    Get a single vertical by ID
// @route   GET /api/verticals/:id
// @access  Private
const getVerticalById = async (req, res) => {
    try {
        const vertical = await Vertical.findById(req.params.id);
        if (!vertical) {
            return res.status(404).json({ message: "Vertical not found." });
        }
        res.json(vertical);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching vertical details." });
    }
};

module.exports = {
    getVerticals,
    getVerticalById,
};