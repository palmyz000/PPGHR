const express = require("express");
const authenticateJWT = require("../../middlewares/authenticateJWT"); // Import Middleware
const { getPayrollData } = require("./payrollController");

const router = express.Router();

// ใช้ Middleware authenticateJWT กับทุก Route ใน payrollRoutes.js
router.use(authenticateJWT);

router.get("/all-payroll", getPayrollData);

module.exports = router;
