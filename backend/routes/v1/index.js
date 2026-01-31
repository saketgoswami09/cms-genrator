const express = require("express");
const authRouter = require("./auth");
const imageRouter = require("../v1/image");
const contentRouter = require("../v1/content");
const resumeRouter = require("../v1/resume"); 
const router = express.Router();

router.use("/auth", authRouter);
router.use("/image", imageRouter);
router.use("/content", contentRouter);
router.use("/resume", resumeRouter); 

module.exports = router;
