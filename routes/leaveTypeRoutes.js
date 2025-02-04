const express = require("express");
const leaveTypeController = require("../controllers/leaveTypeController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allleavetype", leaveTypeController.getAllleave_types);
router.post("/create-leavetype", leaveTypeController.createleave_types);
router.patch("/update-leavetype/:id", leaveTypeController.updateleave_types);
// router.delete("/delete-position/:id", leaveTypeController.removePosition);
// router.get("/single-position/:id", leaveTypeController.singlePosition);

module.exports = router;
