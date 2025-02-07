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

module.exports = {
  createMasterSummaryDetail,
  createMasterSummary,
};
