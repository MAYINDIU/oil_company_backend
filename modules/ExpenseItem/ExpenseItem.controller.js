const ApiError = require("../../errors/APIError");
const expenseItemModel = require("./ExpenseItem.model");
const sendResponse = require("../../utilities/sendResponse");

const createExpenseItem = async (req, res) => {
  try {
    const { expense_name } = req.body;
    if (!expense_name) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const saveData = {
      expense_name: expense_name,
    };
    expenseItemModel.createExpenseItem(saveData, (err, result) => {
      if (err) {
        // Log the error for debugging
        console.error("Error inserting expense_name data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({
        success: true,
        message: "Expense Name created successfully",
        userId: result.insertId, // Assuming `insertId` is the ID of the newly created supplier
      });
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

function getAllExpenseItem(req, res) {
  expenseItemModel.getAllExpenseItem((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all AllExpenseItem successfully",
        data: users,
      });
    }
  });
}

const updateExpenseitem = async (req, res) => {
  const { exp_id } = req.params;

  const { ...data } = req.body;
  // console.log(id, data);
  expenseItemModel.updateExpenseitem(exp_id, data, (err, Expenseitm) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Expense item updated successfully",
        data: Expenseitm,
      });
    }
  });
};

module.exports = {
  createExpenseItem,
  getAllExpenseItem,
  updateExpenseitem,
};
