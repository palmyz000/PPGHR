const express = require('express');
const router = express.Router();
const { 
  getStatus,       // ฟังก์ชันตรวจสอบสถานะการเช็คอิน
  recordAttendance, // ฟังก์ชันบันทึกการเช็คอิน/เช็คเอาท์
  getHistory        // ฟังก์ชันดึงประวัติการเช็คอิน/เช็คเอาท์
} = require('./chekin-chekout');

// Routes
// ตรวจสอบสถานะการเช็คอินล่าสุด
router.get('/status', getStatus);

// บันทึกการเช็คอิน/เช็คเอาท์
router.post('/record', recordAttendance);

// ดึงประวัติการเช็คอิน/เช็คเอาท์
router.get('/history', getHistory);

module.exports = router;
