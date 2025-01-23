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


connectDB();

module.exports = pool;
