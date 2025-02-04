const express = require("express");
const saladvcController = require("../controllers/advanceSalaryController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();


router.get("/allsalaryadvapplication", saladvcController.getAlladvsalaryapplication);
router.post("/create-salary-application", saladvcController.createadvsalaryapplication);
router.get("/salary-application-info/:id", saladvcController.singleSalaryadv_info);
router.put('/approve/:id', saladvcController.approvesalaryApplication);

module.exports = router;
