const db = require('../models/db'); // เชื่อมต่อฐานข้อมูล

// Add Salary Base API
const addSalaryBase = async (req, res) => {
  const { emp_code, base_salary, allowance = 0.0, insurance = 0.0, tax_rate = 0.0 } = req.body;

  // ตรวจสอบว่าได้รับข้อมูลครบถ้วนหรือไม่
  if (!emp_code || !base_salary) {
    return res.status(400).json({
      message: "emp_code และ base_salary เป็นข้อมูลที่จำเป็น",
    });
  }

  try {
    const conn = await db.getConnection();

    // ตรวจสอบว่ามี emp_code อยู่ใน PPGHR_employee_data หรือไม่
    const [employee] = await conn.query(
      "SELECT * FROM PPGHR_employee_data WHERE emp_code = ?",
      [emp_code]
    );

    if (!employee || employee.length === 0) {
      conn.release();
      return res.status(404).json({
        message: "ไม่พบ emp_code ในตาราง PPGHR_employee_data",
      });
    }

    // เพิ่มข้อมูลลงในตาราง PPGHR_salary_base
    await conn.query(
      "INSERT INTO PPGHR_salary_base (emp_code, base_salary, allowance, insurance, tax_rate) VALUES (?, ?, ?, ?, ?)",
      [emp_code, base_salary, allowance, insurance, tax_rate]
    );

    conn.release();

    res.status(201).json({
      message: "เพิ่มข้อมูล Salary Base สำเร็จ",
    });
  } catch (error) {
    console.error("Error adding salary base:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการเพิ่ม Salary Base",
      error: error.message,
    });
  }
};

module.exports = { addSalaryBase };
