const express = require("express");
const authenticateJWT = require("../../middlewares/authenticateJWT"); // Import Middleware
const { addDocumentType, updateDocumentType, getAllDocumentsType, deleteDocumentType } = require("./documentController");

const router = express.Router();

// ใช้ Middleware authenticateJWT กับทุก Route ใน documentRoutes.js
router.use(authenticateJWT);

router.post("/add", addDocumentType);
router.get("/all", getAllDocumentsType);
router.put("/update", updateDocumentType);
router.delete("/delete", deleteDocumentType);

module.exports = router;
