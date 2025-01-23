const express = require('express');
const router = express.Router();
const { getPayrollData } = require('../controllers/payrollController');

// Route สำหรับดึงข้อมูล Payroll
router.get('/all-payroll', getPayrollData);

module.exports = router;
