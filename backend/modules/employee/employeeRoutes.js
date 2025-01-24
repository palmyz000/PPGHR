const express = require("express");
const authenticateJWT = require("../../middlewares/authenticateJWT"); // Import Middleware
const { addEmployee, updateEmployee, getAllEmployees, getEmployeeStatistics, deleteEmployee } = require("./employeeController");

const router = express.Router();

router.post("/add", authenticateJWT, addEmployee); // ป้องกัน API
router.get("/all", getAllEmployees); // อาจไม่ต้องป้องกัน
router.put("/update", authenticateJWT, updateEmployee); // ป้องกัน API
router.get("/statistics", getEmployeeStatistics); // อาจไม่ต้องป้องกัน
router.post("/delete", authenticateJWT, deleteEmployee); // ป้องกัน API

module.exports = router;
