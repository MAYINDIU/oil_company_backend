const express = require("express");
const router = express.Router();
const voucherController = require("./Voucher.controller");

router
  .post("/auto_journal_post", voucherController.createData)
  .get("/auto_journal_all", voucherController.getAllData)
  .get("/journalByDate", voucherController.journalByDateRange)
  .get("/journalByLedgerDate", voucherController.journalByLedgerDateRange)
  .get("/partyLedger", voucherController.partyLedgerController)
  .get("/cus_balance", voucherController.customerOpeningController)
  .get("/received_payment", voucherController.receivedAndPaymentController)
  .get("/cash_book", voucherController.cashBookController)
  .get("/bank_book", voucherController.bankBookController)
  .get("/auto_journal/:id", voucherController.getDataById)
  .get("/auto_journal_vc_no", voucherController.getDataByVcNo)
  .patch("/auto_journal_edit/:journal_id", voucherController.updateDataById)
  .patch("/voucher_update", voucherController.updateDataByVoucherNo)
  .patch(
    "/voucher_unpost_update/:vc_no",
    voucherController.updatePostedDataByVoucherNo
  )
  .delete("/voucher_delete", voucherController.deleteDataByVoucherNo)
  .delete("/auto_journal_remove/:id", voucherController.deleteDataById);

module.exports = router;
