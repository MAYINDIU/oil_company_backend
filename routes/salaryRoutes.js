const express = require("express");
const salaryController = require("../controllers/salaryController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allsalary", salaryController.getAllsalary);
router.post("/create-salary", salaryController.createsalary);
router.patch("/update-salary/:id", salaryController.updatesalary);
router.delete("/delete-salary/:id", salaryController.removesalary);
router.get("/single-salary/:id", salaryController.singlesalarydata);
module.exports = router;
