const db = require('../../models/db');

// Mock function สำหรับดึงข้อมูลตำแหน่ง
const getLocationDetails = async (latitude, longitude) => {
  // TODO: ในอนาคตควรเชื่อมต่อกับ API จริง
  return {
    province: "กรุงเทพมหานคร",
    district: "พญาไท"
  };
};

// ตรวจสอบสถานะการเช็คอินล่าสุด
const getStatus = async (req, res) => {
  const { name, otname } = req.query;
  let conn;

  try {
    if (!name || !otname) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่อพนักงานและชื่อประเภท OT'
      });
    }

    conn = await db.getConnection();

    console.log('Query Parameters:', { name, otname });

    // เปลี่ยนวิธีการ query และการจัดการผลลัพธ์
    const result = await conn.query(
      `SELECT * FROM PPGHR_check_in_out 
       WHERE name = ? 
       AND otname = ? 
       AND Date = CURDATE()
       ORDER BY created_at DESC LIMIT 1`,
      [name, otname]
    );

    // ตรวจสอบว่า result มีข้อมูลและมี rows
    const rows = result && result[0] ? result[0] : [];
    
    console.log('Query Result:', rows);

    res.json({
      success: true,
      data: rows.length > 0 ? rows[0] : null,
      message: rows.length > 0 ? 'พบข้อมูลการเช็คอิน' : 'ไม่พบข้อมูลการเช็คอิน'
    });

  } catch (error) {
    console.error('Error in getStatus:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ',
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

// บันทึกการเช็คอิน-เช็คเอาท์
const recordAttendance = async (req, res) => {
  const {
    name,
    otname,
    latitude,
    longitude
  } = req.body;

  let conn;

  try {
    if (!name || !otname || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
      });
    }

    conn = await db.getConnection();

    console.log('Request Body:', { name, otname, latitude, longitude });

    // ดึงข้อมูลจังหวัดและตำแหน่ง
    const { province, district } = await getLocationDetails(latitude, longitude);

    console.log('Location Details:', { province, district });

    // ตรวจสอบว่ามีการเช็คอินวันนี้หรือยัง
    const [rows] = await conn.query(
      `SELECT * FROM PPGHR_check_in_out 
       WHERE name = ? 
       AND otname = ? 
       AND Date = CURDATE()
       AND end_time IS NULL`,
      [name, otname]
    );

    console.log('Existing Record:', rows);

    await conn.beginTransaction();

    try {
      const currentTime = new Date().toTimeString().slice(0, 8); // รูปแบบเวลา HH:MM:SS

      if (rows.length === 0) {
        // กรณีเช็คอิน
        const [result] = await conn.query(
          `INSERT INTO PPGHR_check_in_out (
            Date,
            start_time,
            otname,
            name,
            province_entered,
            location_entered,
            latitude_entered,
            longitude_entered,
            status
          ) VALUES (
            CURDATE(),
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'เช็คอิน'
          )`,
          [
            currentTime,
            otname,
            name,
            province,
            district,
            latitude,
            longitude
          ]
        );

        console.log('Insert Result:', result);

        await conn.commit();

        res.json({
          success: true,
          action: 'check-in',
          message: 'บันทึกเวลาเข้างานสำเร็จ',
          data: {
            name,
            otname,
            start_time: currentTime,
            province: province,
            location: district
          }
        });

      } else {
        // กรณีเช็คเอาท์
        const [result] = await conn.query(
          `UPDATE PPGHR_check_in_out 
           SET end_time = ?,
               province_issued = ?,
               location_issued = ?,
               latitude_issued = ?,
               longitude_issued = ?,
               status = 'เช็คเอาท์'
           WHERE id = ?`,
          [
            currentTime,
            province,
            district,
            latitude,
            longitude,
            rows[0].id
          ]
        );

        console.log('Update Result:', result);

        await conn.commit();

        res.json({
          success: true,
          action: 'check-out',
          message: 'บันทึกเวลาออกงานสำเร็จ',
          data: {
            name,
            otname,
            end_time: currentTime,
            province: province,
            location: district
          }
        });
      }

    } catch (error) {
      await conn.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error in recordAttendance:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

// ดึงประวัติการเช็คอิน-เช็คเอาท์
const getHistory = async (req, res) => {
  const { name, otname, startDate, endDate } = req.query;
  let conn;

  try {
    if (!name || !otname || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
      });
    }

    conn = await db.getConnection();

    console.log('Query Parameters:', { name, otname, startDate, endDate });

    const [rows] = await conn.query(
      `SELECT * FROM PPGHR_check_in_out 
       WHERE name = ? 
       AND otname = ?
       AND Date BETWEEN ? AND ?
       ORDER BY Date DESC, start_time DESC`,
      [name, otname, startDate, endDate]
    );

    console.log('Query Result:', rows);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติ',
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getStatus,
  recordAttendance,
  getHistory
};