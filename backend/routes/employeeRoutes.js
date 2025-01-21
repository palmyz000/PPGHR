const express = require('express');
const { addEmployee, updateEmployee, getAllEmployees, getEmployeeStatistics } = require('../controllers/employeeController'); // นำเข้าฟังก์ชัน

const router = express.Router();

router.post('/add', addEmployee); 
router.get('/all', getAllEmployees); 
router.put('/update', updateEmployee);
router.get('/statistics', getEmployeeStatistics);

module.exports = router; // ส่งออก Router
