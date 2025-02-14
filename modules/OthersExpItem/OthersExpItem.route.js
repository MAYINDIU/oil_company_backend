const express = require("express");
const expenseitemController = require("./OthersExpItem.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-othersex-item", expenseitemController.getAllOthersExpenseItem);
router.post(
  "/create-others-expense-item",
  expenseitemController.createOthersExpenseItems
);
router.patch(
  "/update-others-exp-item/:other_exp_id",
  expenseitemController.updateOthersExpenseitem
);

module.exports = router;
