const express = require("express");
const {generateImage, history} = require("../../controllers/image.controller");
const { auth } = require("../../middleware/auth"); 

const router = express.Router();

// todo handler for auth
router.post("/generate", auth,generateImage);
router.get("/history", auth,history);
router.get("save", auth,history);
router.get("/delete", auth,history);



module.exports = router;
