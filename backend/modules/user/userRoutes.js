const express = require("express");
const authenticateJWT = require("../../middlewares/authenticateJWT"); // Import Middleware
const userProfile = require("./userController");

const router = express.Router();

router.get("/profile", authenticateJWT, userProfile);

module.exports = router;
