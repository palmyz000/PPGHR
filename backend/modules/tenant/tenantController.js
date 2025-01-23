const db = require('../../models/db');

const getAllTenants = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection(); 

        const query = `
            SELECT * FROM PPGHR_tenants; 
        `;

        const rows = await conn.query(query); 

        conn.release(); 

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลพนักงาน",
                data: [],
            });
        }

        res.status(200).json({
            message: "ดึงข้อมูล tenant",
            data: rows,
        });
    } catch (error) {
        if (conn) conn.release(); 
        console.error("Error fetching tenant:", error);

        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message,
        });
    }
};

module.exports = { getAllTenants };