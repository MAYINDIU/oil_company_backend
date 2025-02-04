const express = require("express");
const departmentController = require("../controllers/departmentController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/alldepartment", departmentController.getAlldepartment);
router.post("/create-department", departmentController.createdepartment);
router.patch("/update-department/:id", departmentController.updatedepartment);
router.delete("/delete-department/:id", departmentController.removedepartment);
router.get("/single-department/:id", departmentController.singledepartment);

module.exports = router;
