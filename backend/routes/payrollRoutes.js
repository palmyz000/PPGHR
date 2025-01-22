const express = require('express');
const router = express.Router();
const { addSalaryBase } = require('../controllers/payrollController');

// Route สำหรับเพิ่ม Salary Base
router.post('/add', addSalaryBase);

module.exports = router;
