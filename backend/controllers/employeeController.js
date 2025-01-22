const db = require('../models/db');

const addEmployee = async (req, res) => {
    const { emp_code, name, email, is_active = 1, position, department, hire_date, phone } = req.body;
  
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
        "INSERT INTO PPGHR_employee_data (emp_code, name, email, is_active, position, department, hire_date, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [emp_code, name, email, is_active, position, department, hire_date, phone]
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

const updateEmployee = async (req, res) => {
    const { emp_code, name, email, is_active, position, department, hire_date, phone } = req.body;

    try {
        const conn = await db.getConnection();

        // ตรวจสอบว่าพนักงานที่ต้องการอัปเดตมีอยู่หรือไม่
        const [existingEmployee] = await conn.query(
            "SELECT * FROM PPGHR_employee_data WHERE emp_code = ?",
            [emp_code]
        );

        if (!existingEmployee || existingEmployee.length === 0) {
            conn.release(); // ปล่อยการเชื่อมต่อ
            return res.status(404).json({
                message: "Employee not found.",
            });
        }

        // อัปเดตข้อมูลพนักงาน
        const result = await conn.query(
            "UPDATE PPGHR_employee_data SET name = ?, email = ?, is_active = ?, position = ?, department = ?, hire_date = ?, phone = ? WHERE emp_code = ?",
            [name, email, is_active, position, department, hire_date, phone, emp_code]
        );

        conn.release();
        res.status(200).json({
            message: "Employee updated successfully!",
        });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Error updating employee.", error });
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


const getEmployeeStatistics = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();

        const totalEmployeesResult = await conn.query(
            "SELECT COUNT(*) AS count FROM PPGHR_employee_data WHERE is_active = 1"
        );
        const totalEmployees = totalEmployeesResult[0]?.count || 0;


        const currentMonthResult = await conn.query(
            "SELECT COUNT(*) AS count FROM PPGHR_employee_data WHERE MONTH(hire_date) = MONTH(CURRENT_DATE()) AND YEAR(hire_date) = YEAR(CURRENT_DATE()) AND is_active = 1"
        );
        const currentMonth = currentMonthResult[0]?.count || 0;
        

        const currentYearResult = await conn.query(
            "SELECT COUNT(*) AS count FROM PPGHR_employee_data WHERE YEAR(hire_date) = YEAR(CURRENT_DATE()) AND is_active = 1"
        );
        const currentYear = currentYearResult[0]?.count || 0;

        const [monthlyResults] = await conn.query(
            "SELECT MONTH(hire_date) AS month, COUNT(*) AS count FROM PPGHR_employee_data WHERE YEAR(hire_date) = YEAR(CURRENT_DATE()) AND is_active = 1 GROUP BY MONTH(hire_date) ORDER BY month"
        );

        // แปลงข้อมูล monthlyResults
        let monthlyStatistics = [];
        if (Array.isArray(monthlyResults)) {
            monthlyStatistics = monthlyResults.map(row => ({
                month: row.month,
                count: parseInt(row.count, 10) || 0,
            }));
        } else if (monthlyResults && typeof monthlyResults === 'object') {
            monthlyStatistics = [
                {
                    month: monthlyResults.month,
                    count: parseInt(monthlyResults.count, 10) || 0,
                },
            ];
        }

        res.status(200).json({
            totalEmployees: parseInt(totalEmployees, 10),
            employeesThisMonth: parseInt(currentMonth, 10),
            employeesThisYear: parseInt(currentYear, 10),
            monthlyStatistics,
        });
    } catch (error) {
        console.error("Error fetching employee statistics:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (conn) conn.release();
    }
};












// ส่งออกฟังก์ชันทั้งหมด
module.exports = { addEmployee, updateEmployee, getAllEmployees, getEmployeeStatistics };
