const express = require("express");
require("dotenv").config();
const cors = require("cors");

const db = require("./db");
const router = require("./routes/v1");

const app = express();

// 🔑 PORT fallback
const PORT = process.env.PORT || 5000;

// 🔌 DB
db();

// 🌐 CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// 🧠 Body parser
app.use(express.json());

// 🚏 Routes
app.use("/v1", router);

// ❤️ Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// 🏠 Root
app.get("/", (req, res) => {
  res.send("Welcome to the CMS Generator API");
});

// ❌ 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});