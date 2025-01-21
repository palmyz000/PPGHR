const express = require('express');
const { addDocumentType, updateDocument, getAllDocuments } = require('../controllers/documentController'); // นำเข้าฟังก์ชัน

const router = express.Router();

router.post('/add', addDocumentType); 
router.get('/all', getAllDocuments); 
router.put('/update', updateDocument);

module.exports = router; // ส่งออก Router
