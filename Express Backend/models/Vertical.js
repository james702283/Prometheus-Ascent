const mongoose = require('mongoose');

const VerticalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vertical name is required.'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Vertical description is required.'],
        trim: true
    },
    skillTaxonomy: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Skill taxonomy is required.']
    }
});

const Vertical = mongoose.model('Vertical', VerticalSchema);

module.exports = Vertical;