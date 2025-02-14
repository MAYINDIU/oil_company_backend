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
    tr_date,
  } = req.body;

  // if (
  //   !station_id ||
  //   !fuel_type ||
  //   !torambo_no ||
  //   !present_reading ||
  //   !sale_unit
  // ) {
  //   return res.status(400).json({ error: "Missing required fields" });
  // }

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
        const sale_unit_calculated = present_reading - previous_reading_db;
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
          tr_date,
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
      sale_unit,
      tr_date,
      rate,
    } = req.body;

    const addCalculation = (sale_unit * rate) / 100;

    // Prepare data for insertion
    const saveData = {
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      sale_unit,
      addition: addCalculation || 0,
      tr_date: tr_date, // Default addition to 0 if not provided
    };

    masterModel.createMasterData(saveData, (err, result) => {
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
        message: "Master detail created successfully",
        data: result,
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
  const { station_id, fuel_type, c_date } = req.query; // Get parameters from query string

  masterModel.getFueltypeMDetail(
    station_id,
    fuel_type,
    c_date,
    (err, results) => {
      // Added the missing comma here
      if (err) {
        console.error("Error fetching toromba data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res
          .status(201)
          .json({ message: "No toromba records found for the specified date" });
      }

      res.status(200).json(results);
    }
  );
};

const getPreviousReadings = (req, res) => {
  const { station_id, fuel_type, torambo_no } = req.query; // Get parameters from query string

  masterModel.getPreviousReading(
    station_id,
    fuel_type,
    torambo_no,
    (err, results) => {
      if (err) {
        console.error("Error fetching previous reading data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results?.length === 0) {
        return res
          .status(201)
          .json({ message: "No previous reading  found today" });
      }

      res.status(200).json(results);
    }
  );
};

const updateReading = async (req, res) => {
  try {
    const {
      updatedPreviousReading,
      present_reading,
      station_id,
      fuel_type,
      torambo_no,
    } = req.body;

    if (
      !updatedPreviousReading ||
      !present_reading ||
      !station_id ||
      !fuel_type ||
      !torambo_no
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(
      updatedPreviousReading,
      present_reading,
      station_id,
      fuel_type,
      torambo_no
    );

    // Call model function with a promise
    const result = await masterModel.updateMasterDatas(
      updatedPreviousReading,
      present_reading,
      station_id,
      fuel_type,
      torambo_no
    );

    return res
      .status(200)
      .json({ message: "Data updated successfully", result });
  } catch (err) {
    console.error("Error updating master data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createMasterDetail,
  getSingleMdetail,
  createOrUpdateMasterData,
  getFueltypeMdetail,
  getPreviousReadings,
  updateReading,
};
