const express = require("express");
const router = express.Router();
const accLedgerController = require("./Ledger.controller");
const authMiddleware = require("../../../middlewares/authMiddleware.js");

router
  .post(
    "/create_acc_ledger",
    authMiddleware(["admin", "user"]),
    accLedgerController.createData
  )
  .get(
    "/all_acc_ledger",
    authMiddleware(["admin", "user"]),
    accLedgerController.getAllData
  )
  .get("/acc_ledger/:id", accLedgerController.getDataById)
  .patch(
    "/acc_ledger_update/:id",
    authMiddleware(["admin"]),
    accLedgerController.updateDataById
  )
  .delete(
    "/acc_ledger_delete/:id",
    authMiddleware(["admin"]),
    accLedgerController.deleteDataById
  );

module.exports = router;
