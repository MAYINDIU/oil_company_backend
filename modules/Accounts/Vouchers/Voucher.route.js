const express = require("express");
const router = express.Router();
const voucherController = require("./Voucher.controller");
const authMiddleware = require("../../../middlewares/authMiddleware.js");

router
  .post(
    "/auto_journal_post",
    authMiddleware(["admin", "user"]),
    voucherController.createData
  )
  .get(
    "/auto_journal_all",
    authMiddleware(["admin", "user"]),
    voucherController.getAllData
  )
  .get(
    "/journalByDate",
    authMiddleware(["admin", "user"]),
    voucherController.journalByDateRange
  )
  .get(
    "/journalByLedgerDate",
    authMiddleware(["admin", "user"]),
    voucherController.journalByLedgerDateRange
  )
  .get(
    "/partyLedger",
    authMiddleware(["admin", "user"]),
    voucherController.partyLedgerController
  )
  .get(
    "/cus_balance",
    authMiddleware(["admin", "user"]),
    voucherController.customerOpeningController
  )
  .get(
    "/received_payment",
    authMiddleware(["admin", "user"]),
    voucherController.receivedAndPaymentController
  )
  .get(
    "/cash_book",
    authMiddleware(["admin", "user"]),
    voucherController.cashBookController
  )
  .get(
    "/bank_book",
    authMiddleware(["admin", "user"]),
    voucherController.bankBookController
  )
  .get(
    "/auto_journal/:id",
    authMiddleware(["admin", "user"]),
    voucherController.getDataById
  )
  .get(
    "/auto_journal_vc_no",
    authMiddleware(["admin", "user"]),
    voucherController.getDataByVcNo
  )
  .patch(
    "/auto_journal_edit/:journal_id",
    authMiddleware(["admin"]),
    voucherController.updateDataById
  )
  .patch(
    "/voucher_update",
    authMiddleware(["admin"]),
    voucherController.updateDataByVoucherNo
  )
  .patch(
    "/voucher_unpost_update/:vc_no",
    authMiddleware(["admin"]),
    voucherController.updatePostedDataByVoucherNo
  )
  .delete(
    "/voucher_delete",
    authMiddleware(["admin"]),
    voucherController.deleteDataByVoucherNo
  )
  .delete(
    "/auto_journal_remove/:id",
    authMiddleware(["admin"]),
    voucherController.deleteDataById
  );

module.exports = router;
