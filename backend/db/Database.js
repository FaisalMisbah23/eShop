const mongoose = require("mongoose");

let connectionPromise = null;

const connectToDb = async () => {
    if (!process.env.DB_URL) {
        throw new Error("DB_URL is not set");
    }

    // Reuse existing connection in serverless warm invocations.
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // Share one in-flight connection attempt across concurrent requests.
    if (connectionPromise) {
        return connectionPromise;
    }

    const connectionUrl = process.env.DB_URL.includes("?appName=")
        ? process.env.DB_URL
        : `${process.env.DB_URL}/eshop?retryWrites=true&w=majority&appName=Cluster0`;

    connectionPromise = mongoose
        .connect(connectionUrl, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
        })
        .then((data) => {
            console.log(`mongodb connected with server: ${data.connection.host}`);
            return data.connection;
        })
        .catch((error) => {
            console.error(`MongoDB connection failed: ${error.message}`);
            throw error;
        })
        .finally(() => {
            connectionPromise = null;
        });

    return connectionPromise;
};

module.exports = connectToDb;