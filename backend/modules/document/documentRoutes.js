const express = require("express");
const authenticateJWT = require("../../middlewares/authenticateJWT"); // Import Middleware
const { addDocumentType, updateDocumentType, getAllDocumentsType, deleteDocumentType, addDocument, getUserDocuments } = require("./documentController");

const router = express.Router();

// ใช้ Middleware authenticateJWT กับทุก Route ใน documentRoutes.js
router.use(authenticateJWT);

router.post("/add-doctype", addDocumentType);
router.get("/all-doctype", getAllDocumentsType);
router.put("/update-doctype", updateDocumentType);
router.delete("/delete-doctype", deleteDocumentType);
router.post("/add-doc", addDocument);
router.get("/my-doc", getUserDocuments);

module.exports = router;
