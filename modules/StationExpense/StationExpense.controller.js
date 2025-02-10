const ApiError = require("../../errors/APIError");
const stationExpenseModel = require("./StationExpense.model");
const sendResponse = require("../../utilities/sendResponse");

const getStationExpenseByStationId = (req, res) => {
  const { station_id } = req.params; // Get station_id from URL parameters

  if (!station_id) {
    return res.status(400).json({ error: "Station ID is required" });
  }

  // Call the model function
  stationExpenseModel.getAllstationExpensebystationid(
    station_id,
    (err, results) => {
      if (err) {
        console.error("Error fetching station expenses:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({
        success: true,
        message: "Fetched station expenses successfully",
        data: results,
      });
    }
  );
};

const createStationExpense = async (req, res) => {
  try {
    const { station_id, expitem_id, amount, remarks } = req.body;

    // Prepare the data to be inserted
    const saveData = {
      station_id,
      expitem_id,
      amount,
      remarks,
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
        message: "Station expense created successfully",
        expenseId: result.insertId, // Assuming `insertId` is the ID of the newly created expense
      });
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

function getAllExpenseAmounts(req, res) {
  stationExpenseModel.getAllstationExpense((err, expenses) => {
    if (err) {
      // Handle errors and send a 500 response with the error message
      res.status(500).json({ error: err.message });
    } else {
      // Send a success response with the fetched data
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all station expenses successfully", // Updated message
        data: expenses,
      });
    }
  });
}

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
  getAllExpenseAmounts,
  getStationExpenseByStationId,
  getTotalExpensebystation,
};
