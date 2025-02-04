const express = require("express");
const employeeController = require("../controllers/employeeController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allEmployees", employeeController.getAllemployees);
router.post("/create-employee", employeeController.createEmployee);
router.patch("/update-employee/:id", employeeController.updateEmployee);
router.delete("/delete-employee/:id", employeeController.removeEmployee);
router.delete("/delete-employee/:id", employeeController.removeEmployee);

router.get("/single-employee/:id", employeeController.singleEmployee);
module.exports = router;
