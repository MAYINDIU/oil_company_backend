const express = require("express");
const stationController = require("./StationOthersExpense.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'

router.post(
  "/create-others-expense-amount",
  stationController.createStationExpense
);

router.get(
  "/total-other-expense/:station_id/:exp_date",
  stationController.getTotalExpensebystation
);

module.exports = router;
