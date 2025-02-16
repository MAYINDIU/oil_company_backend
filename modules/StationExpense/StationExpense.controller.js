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
    const { station_id, expitem_id, amount, remarks, tr_date } = req.body;

    // Prepare the data to be inserted
    const saveData = {
      station_id,
      expitem_id,
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

function getAllStationExpReport(req, res) {
  const { station_id, fromDate, toDate } = req.query;
  stationExpenseModel.allStationExp(
    station_id,
    fromDate,
    toDate,
    (err, expData) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Fetched all Toromba successfully",
          data: expData,
        });
      }
    }
  );
}

function getAllStationExpReportLedger(req, res) {
  const { station_id, fromDate, toDate } = req.query;
  stationExpenseModel.allStationExpLedger(
    station_id,
    fromDate,
    toDate,
    (err, expData) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Fetched all Toromba successfully",
          data: expData,
        });
      }
    }
  );
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
      res.status(201).json({
        success: true,
        data: result,
      });
    }
  );
};






//STATION AND TR DATE WISE 
const getStationExpenseByStationdate = (req, res) => {
  const { station_id,tr_date } = req.query; // Get station_id from URL parameters

  if (!station_id) {
    return res.status(400).json({ error: "Station ID is required" });
  }
  // Call the model function
  stationExpenseModel.getAllstationExpensebystationDate(
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
  const { expense_id} = req.query; // expense_id

  if (!expense_id) {
    return res.status(400).json({ error: "expense_id  is required" });
  }
  // Call the model function
  stationExpenseModel.getStationSingleExpense(
    expense_id,
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
    const { expense_id, station_id, expitem_id, amount, remarks, tr_date } = req.body;

    // Prepare the data to be updated
    const updateData = {
      expense_id,
      station_id,
      expitem_id,
      amount,
      remarks,
      tr_date,
    };

    // Call the model to update the data
    stationExpenseModel.updateSingleExpense(updateData, (err, result) => {
      if (err) {
        console.error("Error updating station expense data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // If no rows were affected, the record may not have been found
      if (result.affectedRows === 0) {
        return res.status(204).json({ error: "Expense not found" });
      }

      // Send success response
      res.status(201).json({
        success: true,
        message: "Station expense updated successfully",
        updatedId: expense_id, // The ID of the updated expense
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
  getAllExpenseAmounts,
  getAllStationExpReport,
  getAllStationExpReportLedger,
  getStationExpenseByStationId,
  getTotalExpensebystation,
  getStationExpenseByStationdate,
  getStationSingleExpense,
  updateSingleStationExpense
};
