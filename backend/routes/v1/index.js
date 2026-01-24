const express = require("express");
const authRouter = require("./auth");
const imageRouter = require("../v1/image");
const contentRouter = require("../v1/content");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/image", imageRouter);
router.use("/content", contentRouter);


module.exports = router;
