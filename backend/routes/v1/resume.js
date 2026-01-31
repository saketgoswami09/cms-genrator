// routes/v1/resume.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { analyzeResume } = require("../../controllers/resume.controller");
const { auth } = require("../../middleware/auth");

// Configure temporary storage
const upload = multer({ dest: "uploads/" });

router.post("/analyze", auth, upload.single("resume"), analyzeResume);

module.exports = router;