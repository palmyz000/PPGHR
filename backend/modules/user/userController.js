const db = require('../../models/db');

const userProfile = async (req, res) => {
    const { id, tenant_id } = req.user; // ดึงข้อมูล user จาก JWT payload
  
    let conn;
    try {
        conn = await db.getConnection();
  
        // Query ดึงข้อมูลโปรไฟล์ผู้ใช้จาก PPGHR_accounts
        const [userAccount] = await conn.query(
            "SELECT emp_code, email, role, tenant_id, created_at FROM PPGHR_accounts WHERE account_id = ? AND tenant_id = ?",
            [id, tenant_id]
        );

        // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
        if (!userAccount) {
            conn.release();
            return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้งานใน PPGHR_accounts" });
        }

        const { emp_code } = userAccount;

        // Query ดึงข้อมูล name จาก PPGHR_employee_data โดยใช้ emp_code
        const [employeeData] = await conn.query(
            "SELECT name FROM PPGHR_employee_data WHERE emp_code = ?",
            [emp_code]
        );

        conn.release();

        // ตรวจสอบว่าพบข้อมูลพนักงานหรือไม่
        if (!employeeData) {
            return res.status(404).json({ message: "ไม่พบข้อมูลพนักงานใน PPGHR_employee_data" });
        }

        // รวมข้อมูลจากทั้งสองตาราง
        const userProfile = {
            ...userAccount,
            name: employeeData.name, // เพิ่มชื่อพนักงาน
        };

        res.status(200).json({
            message: "ดึงข้อมูลโปรไฟล์สำเร็จ",
            data: userProfile,
        });
    } catch (error) {
        if (conn) conn.release();
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};

module.exports = userProfile;
