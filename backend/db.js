const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGO_URL;

async function db() {
  if (mongoose.connection.readyState === 1) {
    console.error("Already connected to database, disconnecting first");
  }
  if (!mongoURL) {
    console.error("MONGO URL is not set in enviorment variable");
  }
  mongoose
    .connect(mongoURL)
    .then(() => {
      const databaseName = mongoose.connection.db.databaseName;
      console.log("Database connected successfully");
    })
    .catch((e) => {
      console.log(`Error in connection to the database ${e.message}`);
    });
}

module.exports = db;
