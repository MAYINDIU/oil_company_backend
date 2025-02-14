const ApiError = require("../../errors/APIError");
const stationExpenseModel = require("./StationOthersExpense.model");
const sendResponse = require("../../utilities/sendResponse");

const createStationExpense = async (req, res) => {
  try {
    const { station_id, other_expitem_id, amount, remarks, tr_date } = req.body;

    // Prepare the data to be inserted
    const saveData = {
      station_id,
      other_expitem_id,
      amount,
      remarks,
      tr_date,
    };

    // Assuming 'stationexpenseModel.createExpenseamount' is the function to insert into the DB
    stationExpenseModel.createExpenseamount(saveData, (err, result) => {
      if (err) {
        // Log the error for debugging
        console.error("Error inserting station expense data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Send success response with the inserted ID
      res.status(201).json({
        success: true,
        message: "Station others expense created successfully",
        expenseId: result.insertId, // Assuming `insertId` is the ID of the newly created expense
      });
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTotalExpensebystation = (req, res) => {
  const { station_id, exp_date } = req.params; // Get the station_id from the request parameters

  stationExpenseModel.getTotalExpenseByStation(
    station_id,
    exp_date,
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch total expense" });
      }
      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
};

module.exports = {
  createStationExpense,
  getTotalExpensebystation,
};
