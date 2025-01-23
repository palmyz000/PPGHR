const db = require('../models/db'); // เชื่อมต่อฐานข้อมูล

const getPayrollData = async (req, res) => {
  const { month } = req.query;

  // ตรวจสอบว่า `month` ถูกส่งมาหรือไม่
  if (!month) {
    return res.status(400).json({
      message: "กรุณาระบุเดือนที่ต้องการในรูปแบบ YYYY-MM",
    });
  }

  try {
    const conn = await db.getConnection();

    // Query สำหรับดึงข้อมูล Payroll
    const query = `
      SELECT 
    emp.emp_code, 
    emp.name, 
    emp.position, 
    emp.department, 
    COALESCE(sb.base_salary, 0) AS salary, 
    COALESCE(SUM(ot.total_ot), 0) AS ot, 
    COALESCE(sp.tax, 0) AS tax, 
    COALESCE(sp.social_security, 0) AS insurance, 
    COALESCE(sp.total_salary - sp.net_salary, 0) AS deductions,
    (COALESCE(sb.base_salary, 0) + COALESCE(SUM(ot.total_ot), 0) - COALESCE(sp.tax, 0) - COALESCE(sp.social_security, 0)) AS net_salary
FROM PPGHR_employee_data emp
LEFT JOIN PPGHR_salary_base sb ON emp.emp_code = sb.emp_code
LEFT JOIN PPGHR_ot ot ON emp.emp_code = ot.emp_code
LEFT JOIN PPGHR_salary_payments sp ON emp.emp_code = sp.emp_code
GROUP BY emp.emp_code, emp.name, emp.position, emp.department, sb.base_salary, sp.tax, sp.social_security, sp.total_salary, sp.net_salary
ORDER BY emp.emp_code;

    `;

    // ดึงข้อมูลจากฐานข้อมูล
    const rows = await conn.query(query, [month, month]);

    conn.release(); // ปล่อยการเชื่อมต่อฐานข้อมูล

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลเงินเดือนสำหรับเดือนที่ระบุ",
      });
    }

    // ส่งข้อมูลกลับไปยัง Client
    res.status(200).json({
      message: "ดึงข้อมูล Payroll สำเร็จ",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล Payroll",
      error: error.message,
    });
  }
};

module.exports = { getPayrollData };
