const ApiError = require("../../errors/APIError");
const masterModel = require("./MasterDetail.model");
const sendResponse = require("../../utilities/sendResponse");

const createOrUpdateMasterData = (req, res) => {
  const {
    station_id,
    fuel_type,
    torambo_no,
    previous_reading,
    present_reading,
    sale_unit,
  } = req.body;

  if (
    !station_id ||
    !fuel_type ||
    !torambo_no ||
    !present_reading ||
    !sale_unit
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Step 1: Check if the record exists
  masterModel.findByStationFuelTorambo(
    station_id,
    fuel_type,
    torambo_no,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        // Record exists, update it
        const previous_reading_db = results[0]?.previous_reading;
        const previous_sale_unit_db = results[0]?.sale_unit;

        // Step 2: Calculate sale_unit and updated previous_reading
        const sale_unit_calculated =
          present_reading - previous_reading_db + previous_sale_unit_db;
        const updatedPreviousReading =
          previous_reading_db + sale_unit_calculated;

        // Step 3: Update the record
        masterModel.updateMasterData(
          updatedPreviousReading,
          present_reading,
          sale_unit_calculated,
          station_id,
          fuel_type,
          torambo_no,
          (updateErr, updateResults) => {
            if (updateErr) {
              return res.status(500).json({ error: "Failed to update record" });
            }
            res.json({
              message: "Record updated successfully",
              data: updateResults,
            });
          }
        );
      } else {
        // Step 4: Insert a new record if it does not exist
        const newRecord = {
          station_id,
          fuel_type,
          torambo_no,
          previous_reading: present_reading,
          present_reading,
          sale_unit: present_reading - previous_reading,
        };

        masterModel.insertMasterData(newRecord, (insertErr, insertResults) => {
          if (insertErr) {
            return res.status(500).json({ error: "Failed to insert record" });
          }
          res.json({
            message: "Record inserted successfully",
            data: insertResults,
          });
        });
      }
    }
  );
};

const createMasterDetail = async (req, res) => {
  try {
    const {
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      addition,
      sale_unit,
    } = req.body;

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
        return res
          .status(201)
          .json({ message: "No toromba records found today" });
      }

      res.status(200).json(results);
    }
  );
};

const getFueltypeMdetail = (req, res) => {
  const { station_id, fuel_type } = req.query; // Get parameters from query string

  masterModel.getFueltypeMDetail(station_id, fuel_type, (err, results) => {
    if (err) {
      console.error("Error fetching toromba data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res
        .status(201)
        .json({ message: "No toromba records found today" });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  createMasterDetail,
  getSingleMdetail,
  createOrUpdateMasterData,
  getFueltypeMdetail,
};
