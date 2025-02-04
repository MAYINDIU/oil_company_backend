const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
// router.get("/allsalary", salaryController.getAllsalary);
router.post("/create-attendance", attendanceController.createattendance);
// router.patch("/update-salary/:id", salaryController.updatesalary);
// router.delete("/delete-salary/:id", salaryController.removesalary);
router.get("/attendance/:id", attendanceController.singleattendancedata);
router.get('/leave-durations/:employee_id', attendanceController.getLeaveDurationsByEmployee);

module.exports = router;
