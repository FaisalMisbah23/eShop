const mongoose = require("mongoose");

const connectToDb = async () => {
    if (!process.env.DB_URL) {
        console.error("MongoDB connection skipped: DB_URL is not set");
        return;
    }

    // Reuse existing connection in serverless warm invocations.
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        const data = await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`mongodb connected with server: ${data.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
    }
};

module.exports = connectToDb;