const express = require("express");
const { auth } = require("../../middleware/auth"); 
const { rewriteContent,getContentHistory ,deleteContentHistory} = require("../../controllers/content.controller");

const router = express.Router();

// todo handler for auth
router.post("/rewrite", auth,rewriteContent);
router.get("/history", auth,getContentHistory);
router.delete("/history/:id", auth, deleteContentHistory);


module.exports = router;
