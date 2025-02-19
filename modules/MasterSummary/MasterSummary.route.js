const express = require("express");
const msummaryController = require("./MasterSummary.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.post("/create-mastersummary", msummaryController.createMasterSummary);
router.get("/previous-stock", msummaryController.getPreviousStk);
router.get("/fuel-summary", msummaryController.getFuelSummary);
router.get("/datewisefuel-summary", msummaryController.getDatewiseFuelSummary);
router.put(
  "/master-summary-update/:station_id/:tr_date",
  msummaryController.updateMasterSummary
);

module.exports = router;
