const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URL;

const db = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(mongoURL, {
      maxPoolSize: 10,        // Allows up to 10 simultaneous connections
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
      socketTimeoutMS: 45000, // Close inactive connections
    });

    console.log(`Connected to Database: ${mongoose.connection.db.databaseName}`);
  } catch (e) {
    console.error(`MongoDB Connection Error: ${e.message}`);
    process.exit(1); // Stop the server if DB fails
  }
};

module.exports = db;