const express = require("express");
const reportController = require("./Reports.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router
  .get("/get-summary-data", reportController.getSummaryData)
  .get("/get-daily-party-report", reportController.getDailyParyReport)
  .get("/daily-report", reportController.getDailyReport);

module.exports = router;
