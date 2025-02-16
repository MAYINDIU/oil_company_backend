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




const getOthersExpenseByStationdate = (req, res) => {
  const { station_id,tr_date } = req.query; // Get station_id from URL parameters

  if (!station_id) {
    return res.status(400).json({ error: "Station ID is required" });
  }
  // Call the model function
  stationExpenseModel.getAllOtherExpensebystationDate(
    station_id,tr_date,
    (err, results) => {
      if (err) {
        console.error("Error fetching station expenses:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({
        success: true,
        message: "Fetched station expenses list successfully",
        data: results,
      });
    }
  );
};


//single expense details
const getStationSingleExpense = (req, res) => {
  const { other_expe_id} = req.query; // expense_id

  if (!other_expe_id) {
    return res.status(400).json({ error: "expense_id  is required" });
  }
  // Call the model function
  stationExpenseModel.getOthersSingleExpense(
    other_expe_id,
    (err, results) => {
      if (err) {
        console.error("Error fetching expense_id wise expenses:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(200).json({
        success: true,
        message: "Fetched single station expenses  successfully",
        data: results,
      });
    }
  );
};



const updateSingleStationExpense = async (req, res) => {
  try {
    const {station_id, other_expitem_id, amount, remarks, tr_date, other_expe_id} = req.body;

    // Prepare the data to be updated
    const updateData = {
      station_id, other_expitem_id, amount, remarks, tr_date, other_expe_id
    };

    // Call the model to update the data
    stationExpenseModel.updateSingleExpense(updateData, (err, result) => {
      if (err) {
        console.error("Error updating others expense data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // If no rows were affected, the record may not have been found
      if (result.affectedRows === 0) {
        return res.status(204).json({ error: "Expense not found" });
      }

      // Send success response
      res.status(201).json({
        success: true,
        message: "Others expense updated successfully",
        updatedId: other_expitem_id, // The ID of the updated expense
      });
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  createStationExpense,
  getTotalExpensebystation,
  getOthersExpenseByStationdate,
  getStationSingleExpense,
  updateSingleStationExpense
  
};
