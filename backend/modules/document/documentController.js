const db = require('../../models/db');

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


const addDocument = async (req, res) => {
    const { document_name, description, doc_type_name, file_path = null , start_time, end_time} = req.body;
    const { emp_code, tenant_id } = req.user;

    try {
        const conn = await db.getConnection();

        // ค้นหา doc_type_id จาก doc_type_name
        const [docType] = await conn.query(
            "SELECT doc_type_id FROM PPGHR_document_types WHERE doc_type_name = ?",
            [doc_type_name]
        );

        console.log("Query Result for doc_type:", docType);

        if (!docType || !docType.doc_type_id) {
            conn.release();
            return res.status(400).json({
                message: "ไม่พบประเภทเอกสารที่ระบุ",
            });
        }

        const doc_type_id = docType.doc_type_id;
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const result = await conn.query(
            `INSERT INTO PPGHR_documents (
                document_name, 
                description, 
                doc_type_id, 
                uploaded_by, 
                tenant_id, 
                upload_date, 
                last_updated, 
                file_path, 
                status,
                start_time,
                end_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                document_name,
                description,
                doc_type_id,
                emp_code,
                tenant_id,
                currentDate,
                currentDate,
                file_path,
                'pending',
                start_time,
                end_time
            ]
        );

        console.log("Insert result:", result);

        conn.release();
        res.status(201).json({
            message: "เพิ่มเอกสารสำเร็จ",
            document_id: result.insertId, // แก้ไขจาก result[0].insertId เป็น result.insertId
            doc_type_name: doc_type_name
        });
    } catch (error) {
        console.error("Error adding document:", error);
        res.status(500).json({ 
            message: "ไม่สามารถเพิ่มเอกสารได้", 
            error: error.message 
        });
    }
};





const getUserDocuments = async (req, res) => { ///// ยังมีปัญหา


    let conn;
    try {
        conn = await db.getConnection();

        const query = `
            SELECT * 
            FROM PPGHR_documents 
            
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
        console.error("Error fetching documents:", error);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message,
        });
    } finally {
        if (conn) conn.release();
    }
};




  

  




















































  


module.exports = { addDocumentType, updateDocumentType, getAllDocumentsType, deleteDocumentType, addDocument, getUserDocuments };
