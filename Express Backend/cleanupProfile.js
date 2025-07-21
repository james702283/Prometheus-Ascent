require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.js');
const Profile = require('./models/Profile.js');

const USER_EMAIL_TO_CLEAN = 'james.nelson@pursuit.org'; // Your user email

const cleanup = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected.');

        console.log(`Finding user with email: ${USER_EMAIL_TO_CLEAN}`);
        const user = await User.findOne({ email: USER_EMAIL_TO_CLEAN });

        if (!user) {
            console.log('User not found. No action needed.');
            return;
        }

        console.log(`User found with ID: ${user._id}`);
        console.log('Attempting to delete associated profile...');

        const result = await Profile.deleteOne({ user: user._id });

        if (result.deletedCount > 0) {
            console.log(`SUCCESS: Successfully deleted ${result.deletedCount} profile document(s).`);
        } else {
            console.log('No matching profile document found to delete.');
        }

    } catch (error) {
        console.error('An error occurred during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
};

cleanup();