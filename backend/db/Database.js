const mongoose = require("mongoose")

const connectToDb = () => {
  const uri = process.env.DB_URL || process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing DB_URL or MONGO_URI — set one in config/.env");
    return;
  }
  mongoose
    .connect(uri)
    .then((data) => {
      console.log(`mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
    });
};

module.exports = connectToDb;