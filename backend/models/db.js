const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 1,
  supportBigNumbers: true,
  bigNumberStrings: true,
  idleTimeout: 30000, // ปิด Connection ที่ไม่ได้ใช้งานภายใน 30 วินาที
  acquireTimeout: 30000, // Timeout สำหรับการร้องขอ Connection
});


const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database connected successfully!");
    conn.release();  
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

// ฟังก์ชัน Query ที่รองรับ Multi-Tenant
const query = async (sql, params = [], tenantId = null) => {
  let tenantParams = params;
  if (tenantId) {
    tenantParams = [tenantId, ...params];
  }

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(sql, tenantParams);
    conn.release();
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึง Connection แบบ Manual (หากต้องการ)
const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("Error getting connection:", error);
    throw error;
  }
};

connectDB();

module.exports = { pool, query, getConnection };
