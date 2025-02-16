const ApiError = require("../../errors/APIError");
const mastersummaryModel = require("./MasterSummary.model");
const sendResponse = require("../../utilities/sendResponse");

const createMasterSummaryDetail = async (req, res) => {
  try {
    // Extract all data from request body
    const saveData = { ...req.body }; // This ensures all fields are included

    // Insert into database
    mastersummaryModel.createMasterSummaryData(saveData, (err, result) => {
      if (err) {
        console.error("Error inserting master summary detail:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({
        success: true,
        message: "Master detail created successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createMasterSummary = async (req, res) => {
  const mDetail = req.body; // Extracting data from the request body

  // Call the createMasterSummaryDatacheck function to check and insert the record
  mastersummaryModel.createMasterSummaryDatacheck(mDetail, (err, result) => {
    if (err) {
      // If an error occurs (either a database error or a duplicate record)
      return res.status(200).json({
        success: false,
        message: err || "Failed to create the record",
      });
    }

    // If the record was successfully created
    return res.status(200).json({
      success: true,
      message: "Master summary created successfully",
      data: result,
    });
  });
};

const getPreviousStk = (req, res) => {
  const { station_id,tr_date} = req.query;



  mastersummaryModel.getLatestPreviousStock(station_id,tr_date, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (Object.keys(result).length === 0) {
      return res.status(201).json({ message: "No data found" });
    }

    res.status(200).json(result);
  });
};

const getFuelSummary = async (req, res) => {
  try {
    const { stationId, fromDate, toDate } = req.query;

      // Check if all required parameters are provided
      if (!stationId || !fromDate || !toDate) {
          return res.status(400).json({ message: "stationId, fromDate, and toDate are required." });
      }

      // Fetch data from the model
      const data = await mastersummaryModel.getFuelSummary(stationId, fromDate, toDate);
      
      res.status(200).json(data);
  } catch (error) {
      res.status(204).json({ message: "Server Error", error: error.message });
  }
};


const getDatewiseFuelSummary = async (req, res) => {
  try {
      const {fromDate, toDate } = req.query;


      // Fetch data from the model
      const data = await mastersummaryModel.getDatewiseFuelSummary( fromDate, toDate);
      
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
};





module.exports = {
  createMasterSummaryDetail,
  createMasterSummary,
  getPreviousStk,
  getFuelSummary,
  getDatewiseFuelSummary
};
