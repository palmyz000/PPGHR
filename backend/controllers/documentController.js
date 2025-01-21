const db = require('../models/db');

const addDocumentType = async (req, res) => {
    const { doc_type_name, description, access_level = 1 } = req.body;
  
    try {
      const conn = await db.getConnection();
      const [existingdoc_type_name] = await conn.query(
        "SELECT * FROM PPGHR_document_types WHERE doc_type_name = ?",
        [doc_type_name]
      );
  
  
      if (existingdoc_type_name && existingdoc_type_name.length > 0) {
        conn.release(); // ปล่อยการเชื่อมต่อ
        return res.status(400).json({
          message: "doc_type_name already exists.",
        });
      }

      const result = await conn.query(
        "INSERT INTO PPGHR_document_types (doc_type_name, description, access_level) VALUES (?, ?, ?)",
        [doc_type_name, description, access_level]
      );
  
      console.log("Insert result:", result);
  
      conn.release(); 
      res.status(201).json({
        message: "doc_type_name added successfully!",
      });
    } catch (error) {
      console.error("Error adding doc_type_name:", error);
      res.status(500).json({ message: "Error adding doc_type_name.", error });
    }
  };

const updateDocument = async (req, res) => {
    const { doc_type_name, description, access_level } = req.body;

    try {
        const conn = await db.getConnection();

        // ตรวจสอบว่าพนักงานที่ต้องการอัปเดตมีอยู่หรือไม่
        const [existingdoc_type_name] = await conn.query(
            "SELECT * FROM PPGHR_document_types WHERE doc_type_name = ?",
            [doc_type_name]
        );

        if (!existingdoc_type_name || existingdoc_type_name.length === 0) {
            conn.release(); // ปล่อยการเชื่อมต่อ
            return res.status(404).json({
                message: "existingdoc_type_name not found.",
            });
        }

        // อัปเดตข้อมูลพนักงาน
        const result = await conn.query(
            "UPDATE PPGHR_document_types SET doc_type_name = ?, description = ?, access_level = ?",
            [doc_type_name, description, access_level]
        );

        conn.release();
        res.status(200).json({
            message: "doc_type_name updated successfully!",
        });
    } catch (error) {
        console.error("Error updating doc_type_name:", error);
        res.status(500).json({ message: "Error updating doc_type_name.", error });
    }
};



const getAllDocuments = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection(); 

        const query = `
            SELECT * FROM PPGHR_document_types; 
        `;

        const rows = await conn.query(query); 

        conn.release(); 

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลเอกสาร",
                data: [],
            });
        }

        // ส่ง JSON พร้อมข้อมูล
        res.status(200).json({
            message: "ดึงข้อมูลเอกสารสำเร็จ",
            data: rows,
        });
    } catch (error) {
        if (conn) conn.release(); 
        console.error("Error fetching doc_type_name:", error);

        // ส่ง JSON สำหรับข้อผิดพลาด
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message,
        });
    }
};



// ส่งออกฟังก์ชันทั้งหมด
module.exports = { addDocumentType, updateDocument, getAllDocuments };
