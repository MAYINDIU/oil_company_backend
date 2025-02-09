const express = require("express");
const msummaryController = require("./MasterSummary.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.post("/create-mastersummary", msummaryController.createMasterSummary);
router.get("/previous-stock", msummaryController.getPreviousStk);
module.exports = router;
