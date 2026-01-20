const express = require("express");
const {generateImage} = require("../../controllers/image.controller");
// const { auth } = require("../../middleware/auth"); 

const router = express.Router();

// todo handler for auth
router.post("/generate",  generateImage);



module.exports = router;
