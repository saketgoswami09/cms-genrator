// routes/v1/resume.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { analyzeResume } = require("../../controllers/resume.controller");
const { auth } = require("../../middleware/auth");

// Configure temporary PDF storage.
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) return next();

    const message =
      error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Resume PDF must be 5MB or smaller"
        : error.message;

    return res.status(400).json({
      success: false,
      message,
    });
  });
};

router.post("/analyze", auth, uploadResume, analyzeResume);

module.exports = router;
