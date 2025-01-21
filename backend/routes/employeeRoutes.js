const express = require('express');
const { addEmployee, getAllEmployees } = require('../controllers/employeeController'); // นำเข้าฟังก์ชัน

const router = express.Router();

router.post('/add', addEmployee); // เชื่อมต่อฟังก์ชัน addEmployee
router.get('/all', getAllEmployees); // เชื่อมต่อฟังก์ชัน getAllEmployees

module.exports = router; // ส่งออก Router
