const ApiError = require("../../errors/APIError");
const masterModel = require("./MasterDetail.model");
const sendResponse = require("../../utilities/sendResponse");

const createMasterDetail = async (req, res) => {
  try {
    const {
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      addition,
    } = req.body;

    // Calculate `sale_unit`
    const sale_unit = present_reading - previous_reading;

    // Prepare data for insertion
    const saveData = {
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      sale_unit,
      addition: addition || 0, // Default addition to 0 if not provided
    };

    // Insert into database
    masterModel.createMasterData(saveData, (err, result) => {
      if (err) {
        console.error("Error inserting master detail reading:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({
        success: true,
        message: "Master detail  created successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSingleMdetail = (req, res) => {
  const { station_id, fuel_type, torambo_no } = req.query; // Get parameters from query string

  masterModel.getFilteredMDetail(
    station_id,
    fuel_type,
    torambo_no,
    (err, results) => {
      if (err) {
        console.error("Error fetching toromba data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(201).json({ message: "No toromba records found " });
      }

      res.status(200).json(results);
    }
  );
};

module.exports = {
  createMasterDetail,
  getSingleMdetail,
};
