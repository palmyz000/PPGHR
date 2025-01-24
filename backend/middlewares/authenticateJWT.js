const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authorization header missing or invalid.");
    return res.status(401).json({ message: "Unauthorized, token is missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT Payload:", decoded);
    req.user = decoded; // ส่งข้อมูลต่อไปยัง Controller
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.status(403).json({ message: "Forbidden, invalid token" });
  }
};


module.exports = authenticateJWT;
