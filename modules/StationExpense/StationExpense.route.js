const express = require("express");
const stationController = require("./StationExpense.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-expense-amount", stationController.getAllExpenseAmounts);
router.get("/station-expense-report", stationController.getAllStationExpReport);
router.get("/station-expense-ledger", stationController.getAllStationExpReportLedger);
router.post("/create-expense-amount", stationController.createStationExpense);
router.get(
  "/station-expense/:station_id",
  stationController.getStationExpenseByStationId
);

router.get(
  "/total-expense/:station_id/:exp_date",
  stationController.getTotalExpensebystation
);

router.get(
  "/stationdatewiseexpense",
  stationController.getStationExpenseByStationdate
);

router.get(
  "/single-expense-details",
  stationController.getStationSingleExpense
);


router.put('/updatesingle-expense', stationController.updateSingleStationExpense);



module.exports = router;
