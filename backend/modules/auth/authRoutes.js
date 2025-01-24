const express = require('express');
const { createAccount, login } = require('./authController');

const router = express.Router();

router.post('/login', login);
router.post('/create', createAccount);

module.exports = router; // ต้องแน่ใจว่าใช้ module.exports
