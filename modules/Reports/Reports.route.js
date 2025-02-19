const express = require("express");
const msummaryReportController = require("./Reports.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router
  .get("/get-summary-data", msummaryReportController.getSummaryData)
  // .get("/daily-sales-report", msummaryReportController.getDailySalesReport);

module.exports = router;
