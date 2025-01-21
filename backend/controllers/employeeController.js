const db = require('../models/db');

const addEmployee = async (req, res) => {
    const { emp_code, name, email, is_active = 1, position, department, hire_date } = req.body;
  
    try {
      const conn = await db.getConnection();
      const [existingEmployee] = await conn.query(
        "SELECT * FROM PPGHR_employee_data WHERE emp_code = ? OR email = ?",
        [emp_code, email]
      );
  
  
      if (existingEmployee && existingEmployee.length > 0) {
        conn.release(); // ปล่อยการเชื่อมต่อ
        return res.status(400).json({
          message: "Employee code or email already exists.",
        });
      }

      const result = await conn.query(
        "INSERT INTO PPGHR_employee_data (emp_code, name, email, is_active, position, department, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [emp_code, name, email, is_active, position, department, hire_date]
      );
  
      console.log("Insert result:", result);
  
      conn.release(); 
      res.status(201).json({
        message: "Employee added successfully!",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      res.status(500).json({ message: "Error adding employee.", error });
    }
  };




const getAllEmployees = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection(); 

        const query = `
            SELECT * FROM PPGHR_employee_data; 
        `;

        const rows = await conn.query(query); // Query ข้อมูล

        conn.release(); 

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "ไม่พบข้อมูลพนักงาน",
                data: [],
            });
        }

        // ส่ง JSON พร้อมข้อมูล
        res.status(200).json({
            message: "ดึงข้อมูลพนักงานสำเร็จ",
            data: rows,
        });
    } catch (error) {
        if (conn) conn.release(); 
        console.error("Error fetching employees:", error);

        // ส่ง JSON สำหรับข้อผิดพลาด
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error.message,
        });
    }
};



// ส่งออกฟังก์ชันทั้งหมด
module.exports = { addEmployee, getAllEmployees };
