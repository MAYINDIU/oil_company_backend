const ApiError = require("../../errors/APIError");
const expensesItemModel = require("./OthersExpItem.model");
const sendResponse = require("../../utilities/sendResponse");

const createOthersExpenseItems = async (req, res) => {
  try {
    const { exp_name } = req.body;

    if (!exp_name || exp_name.trim() === "") {
      return res.status(400).json({ error: "Expense name is required" });
    }

    // Optionally, add validation or sanitization for `other_expense_name`
    const saveData = { other_expense_name: exp_name.trim() };

    expensesItemModel.createOthExpenseItem(saveData, (err, result) => {
      if (err) {
        console.error("Error inserting expense name data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!result || !result.insertId) {
        return res.status(400).json({ error: "Failed to create expense name" });
      }

      res.status(201).json({
        success: true,
        message: "Expense Name created successfully",
        userId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

function getAllOthersExpenseItem(req, res) {
  expensesItemModel.getAllOtherExpItem((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all All Expense Item successfully",
        data: users,
      });
    }
  });
}

const updateOthersExpenseitem = async (req, res) => {
  const { other_exp_id } = req.params;

  const { ...data } = req.body;
  // console.log(id, data);
  expensesItemModel.updateOthersExpitem(
    other_exp_id,
    data,
    (err, Expenseitm) => {
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
    }
  );
};

module.exports = {
  createOthersExpenseItems,
  getAllOthersExpenseItem,
  updateOthersExpenseitem,
};
