const db = require('../models/db');

const addDocumentType = async (req, res) => {
    const { doc_type_name, description, access_level = 1, max_days, doc_type_id } = req.body;
  
    try {
      const conn = await db.getConnection();
      const [existingdoc_type_name] = await conn.query(
        "SELECT * FROM PPGHR_document_types WHERE doc_type_id = ?",
        [doc_type_id]
      );
  
  
      if (existingdoc_type_name && existingdoc_type_name.length > 0) {
        conn.release(); // ปล่อยการเชื่อมต่อ
        return res.status(400).json({
          message: "doc_type_id already exists.",
        });
      }

      const result = await conn.query(
        "INSERT INTO PPGHR_document_types (doc_type_name, description, access_level, max_days, doc_type_id) VALUES (?, ?, ?, ?, ?)",
        [doc_type_name, description, access_level, max_days, doc_type_id]
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

  const updateDocumentType = async (req, res) => {
    const { doc_type_id, access_level } = req.body;

    if (!doc_type_id || access_level === undefined) {
        return res.status(400).json({
            message: "ข้อมูลไม่ครบถ้วน: ต้องระบุ doc_type_id และ access_level"
        });
    }

    try {
        const conn = await db.getConnection();

        // ตรวจสอบว่ามี doc_type_id นี้อยู่หรือไม่
        const [existingDocument] = await conn.query(
            "SELECT * FROM PPGHR_document_types WHERE doc_type_id = ?",
            [doc_type_id]
        );

        if (!existingDocument || existingDocument.length === 0) {
            conn.release();
            return res.status(404).json({
                message: "ไม่พบประเภทเอกสารที่ระบุ"
            });
        }

        // อัปเดตเฉพาะ access_level
        await conn.query(
            "UPDATE PPGHR_document_types SET access_level = ? WHERE doc_type_id = ?",
            [access_level, doc_type_id]
        );

        conn.release();
        res.status(200).json({
            success: true,
            message: "อัปเดต access_level สำเร็จ!"
        });
    } catch (error) {
        console.error("Error updating access_level:", error);
        res.status(500).json({
            message: "ไม่สามารถอัปเดต access_level ได้",
            error: error.message
        });
    }
};




const getAllDocumentsType = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection(); 

        const query = `
            SELECT * FROM PPGHR_document_types; 
        `;

        const rows = await conn.query(query);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลเอกสาร",
                data: [],
            });
        }

        res.status(200).json({
            message: "ดึงข้อมูลเอกสารสำเร็จ",
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching doc_type_name:", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message,
        });
    } finally {
        if (conn) conn.release(); // Ensure connection is released
    }
};



const deleteDocumentType = async (req, res) => {
    const { id } = req.body;

    try {
        const conn = await db.getConnection();

        // ตรวจสอบว่าประเภทเอกสารที่ต้องการลบมีอยู่หรือไม่
        const [existingDocumentType] = await conn.query(
            "SELECT * FROM PPGHR_document_types WHERE id = ?",
            [id]
        );

        if (!existingDocumentType || existingDocumentType.length === 0) {
            conn.release(); // ปล่อยการเชื่อมต่อ
            return res.status(404).json({
                message: "ประเภทเอกสารไม่พบในระบบ",
            });
        }

        // ลบประเภทเอกสาร
        await conn.query("DELETE FROM PPGHR_document_types WHERE id = ?", [id]);

        conn.release();
        res.status(200).json({
            message: "ลบประเภทเอกสารสำเร็จ!",
        });
    } catch (error) {
        console.error("Error deleting document type:", error);
        res.status(500).json({ message: "ไม่สามารถลบประเภทเอกสารได้", error });
    }
};

module.exports = {
    deleteDocumentType,
};





















































  

// ส่งออกฟังก์ชันทั้งหมด
module.exports = { addDocumentType, updateDocumentType, getAllDocumentsType, deleteDocumentType };
