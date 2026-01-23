const express = require("express");
const { auth } = require("../../middleware/auth"); 
const { rewriteContent } = require("../../controllers/content.controller");

const router = express.Router();

// todo handler for auth
router.post("/rewrite", auth,rewriteContent);



module.exports = router;
