const express = require("express");
const expenseitemController = require("./ExpenseItem.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-expense-item", expenseitemController.getAllExpenseItem);
router.post("/create-expense-item", expenseitemController.createExpenseItem);
router.patch(
  "/update-expense-item/:exp_id",
  expenseitemController.updateExpenseitem
);

module.exports = router;
