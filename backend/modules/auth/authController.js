require("dotenv").config(); // โหลดค่าใน .env
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../models/db");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("Error: JWT_SECRET is not set in the .env file.");
  process.exit(1);
}

// สร้างบัญชีผู้ใช้งานใหม่
const createAccount = async (req, res) => {
  const { tenant_id, emp_code, email, password, role } = req.body;

  try {
    const conn = await pool.getConnection();

    // ตรวจสอบว่า tenant_id มีอยู่ในระบบหรือไม่
    const [tenant] = await conn.query(
      "SELECT * FROM PPGHR_tenants WHERE tenant_id = ?",
      [tenant_id]
    );

    if (!tenant || tenant.length === 0) {
      conn.release();
      return res.status(404).json({ message: "ไม่พบ Tenant ที่ระบุ" });
    }

    // ตรวจสอบว่ามีพนักงานใน tenant_id นั้นหรือไม่ (ถ้าใช้ emp_code เป็นการอ้างอิง)
    const [existingEmployee] = await conn.query(
      "SELECT * FROM PPGHR_employee_data WHERE emp_code = ? AND tenant_id = ?",
      [emp_code, tenant_id]
    );

    if (!existingEmployee || existingEmployee.length === 0) {
      conn.release();
      return res.status(404).json({ message: "ไม่พบพนักงานใน Tenant ที่ระบุ" });
    }

    // ตรวจสอบว่า email นี้มีบัญชีผู้ใช้อยู่แล้วหรือไม่
    const [existingAccount] = await conn.query(
      "SELECT * FROM PPGHR_accounts WHERE email = ? AND tenant_id = ?",
      [email, tenant_id]
    );

    if (existingAccount && existingAccount.length > 0) {
      conn.release();
      return res.status(400).json({ message: "Email นี้มีบัญชีอยู่แล้ว" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มบัญชีผู้ใช้งานใหม่
    await conn.query(
      "INSERT INTO PPGHR_accounts (tenant_id, emp_code, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [tenant_id, emp_code, email, hashedPassword, role]
    );

    conn.release();
    res.status(201).json({ message: "สร้างบัญชีสำเร็จ" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
  }
};

const login = async (req, res) => {
  const { tenant_id, email, password } = req.body;
 
  try {
    const conn = await pool.getConnection();
    
    const [rows] = await conn.query(
      "SELECT * FROM PPGHR_accounts WHERE email = ? AND tenant_id = ?",
      [email, tenant_id]
    );
 
    console.log("Query result:", rows); // ดูข้อมูลที่ได้
    
    const foundUser = rows[0]; // แก้การเข้าถึงข้อมูล เพราะ rows เป็น array แล้ว
    
    if (!foundUser) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
 
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
 
    const token = jwt.sign(
      { tenant_id: foundUser.tenant_id, emp_code: foundUser.emp_code, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
 
    conn.release();
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ", 
      token,
      tenant_id: foundUser.tenant_id,
      role: foundUser.role
    });
 
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
 };




// Export Controller Functions
module.exports = { createAccount, login };
