const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    assessments: {
        type: Map,
        of: {
            vertical: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vertical'
            },
            skills: {
                type: mongoose.Schema.Types.Mixed
            },
            lastUpdated: Date
        }
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;