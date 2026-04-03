const mongoose = require("mongoose");

const connectToDb = async () => {
    if (!process.env.DB_URL) {
        console.error("MongoDB connection skipped: DB_URL is not set");
        return false;
    }

    // Reuse existing connection in serverless warm invocations.
    if (mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection");
        return true;
    }

    try {
        // Ensure appName parameter is included for MongoDB Atlas
        const connectionUrl = process.env.DB_URL.includes("?appName=")
            ? process.env.DB_URL
            : `${process.env.DB_URL}/?appName=Cluster0`;

        const data = await mongoose.connect(connectionUrl, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
        });
        console.log(`mongodb connected with server: ${data.connection.host}`);
        return true;
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        return false;
    }
};

module.exports = connectToDb;