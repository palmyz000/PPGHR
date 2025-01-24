const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  // อ่าน Header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // ดึง Token จาก Header
  const token = authHeader.split(" ")[1]; // Bearer {token}

  // ตรวจสอบความถูกต้องของ Token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // แนบข้อมูลจาก Token ไปยัง Request Object
    req.user = user; // เช่น { tenant_id: 'PPGHR0001', emp_code: '2', role: 'employee' }
    next(); // ไปยังขั้นตอนถัดไป
  });
};

module.exports = authenticateJWT;
