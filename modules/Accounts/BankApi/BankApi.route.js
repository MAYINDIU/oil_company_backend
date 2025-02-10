const express = require("express");
const router = express.Router();
const bankController = require("./BankApi.controller");
// const authMiddleware = require("../../../middleware/authMiddleware");

router
  .post("/create_bank", bankController.createData)
  .get(
    "/all_bank",
    // authMiddleware(["admin", "user"]),
    bankController.getAllData
  )
  .get(
    "/bank/:id",
    // authMiddleware(["admin", "user"]),
    bankController.getDataById
  )
  .patch(
    "/bank_update/:id",
    // authMiddleware(["admin"]),
    bankController.updateDataById
  )
  .delete(
    "/bank_delete/:id",
    // authMiddleware(["admin"]),
    bankController.deleteDataById
  );

module.exports = router;
