const express = require("express");
const leaveApplicationController = require("../controllers/leaveapplicationController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allleave-application", leaveApplicationController.getAllleaveapplication);
router.post("/create-leaveapplication", leaveApplicationController.createLeaveApplication);
router.put('/approve/:leave_application_id', leaveApplicationController.approveLeaveApplication);

router.delete("/delete-leaveapplication/:leave_application_id", leaveApplicationController.removeleave_application);
router.get("/single-leaveinfo/:id", leaveApplicationController.singleleave_info);

module.exports = router;
