const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection successful");
    } catch (error) {
        throw error
    }
};

module.exports = connectDB;