const mariadb = require("mariadb");
require("dotenv").config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  supportBigNumbers: true,
  bigNumberStrings: true, // BigInt จะถูกแปลงเป็น String
});

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Database connected successfully!");
    conn.release();  // ปล่อยการเชื่อมต่อหลังจากตรวจสอบ
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

// เรียกใช้งานฟังก์ชัน
connectDB();

module.exports = pool;
