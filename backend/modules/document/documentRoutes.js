const express = require('express');
const { addDocumentType, updateDocumentType, getAllDocumentsType, deleteDocumentType } = require('./documentController'); // นำเข้าฟังก์ชัน

const router = express.Router();

router.post('/add', addDocumentType); 
router.get('/all', getAllDocumentsType); 
router.put('/update', updateDocumentType);
router.delete('/delete', deleteDocumentType);


module.exports = router; // ส่งออก Router
