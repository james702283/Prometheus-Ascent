const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Mongoose 6+ no longer requires the options object (useNewUrlParser, etc.)
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection established successfully via config/db.js.');
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Exit process with failure if we can't connect to the database
        process.exit(1);
    }
};

module.exports = connectDB;