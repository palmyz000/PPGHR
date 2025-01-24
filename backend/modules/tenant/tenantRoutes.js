const express = require('express');
const { getAllTenants } = require('./tenantController');

const router = express.Router();

router.get('/all-tenant', getAllTenants);


module.exports = router; // ต้องแน่ใจว่าใช้ module.exports
