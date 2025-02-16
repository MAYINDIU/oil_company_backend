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
    } = req.body;

    const addCalculation = (sale_unit * 5) / 100;

    // Prepare data for insertion
    const saveData = {
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      sale_unit,
      tr_date,
      // Additional field for calculation
      addition: addCalculation || 0, // Default addition to 0 if not provided
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

const getPrevReadingData = (req, res) => {
  const { station_id, fuel_type, torambo_no, tr_date } = req.query;

  // Call the service to get previous reading
  masterModel.getPrevReading(
    station_id,
    fuel_type,
    torambo_no,
    tr_date,
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Internal server error", details: err });
      }

      if (result.message) {
        return res.status(404).json(result); // No previous reading found
      }

      return res.status(201).json({
        success: true,
        previousReading: result, // Send the reading as response
      });
    }
  );
};

const getSingleMdetaildata = (req, res) => {
  const { id } = req.query;

  // Call the service to get previous reading
  masterModel.getSinglemDetails(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Internal server error", details: err });
    }

    if (result.message) {
      return res.status(404).json(result); // No previous reading found
    }

    return res.status(201).json({
      success: true,
      previousReading: result, // Send the reading as response
    });
  });
};

const updateMasterSingleDetail = async (req, res) => {
  try {
    const {
      id, // The ID of the record to update
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      sale_unit,
    } = req.body;

    // Calculate the addition (5% of sale_unit)
    const addCalculation = (sale_unit * 5) / 100;

    // Prepare data for updating
    const updateData = {
      station_id,
      fuel_type,
      torambo_no,
      previous_reading,
      present_reading,
      sale_unit,
      addition: addCalculation || 0, // Default to 0 if calculation fails
    };

    // Check if id is provided
    if (!id) {
      return res
        .status(400)
        .json({ error: "ID is required to update the record" });
    }

    // Call the model to update the record
    masterModel.updateMasterSingleData(id, updateData, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // If no rows are affected, return a 404 error
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      // Successfully updated the record
      res.status(200).json({
        success: true,
        message: "Master detail updated successfully",
        id: id,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

const MDetailBackupDelete = (req, res) => {
  const { id } = req.params;
  console.log(id);

  // Call the service to get previous reading
  masterModel.MdetailbackupAndDelete(id, (err, result) => {
    if (err) {
      // If there is an error, respond with an error message
      return res.status(500).json({
        success: false,
        message: "Error during backup and delete",
        error: err.message,
      });
    }

    // On success, send a success message
    return res.status(200).json({
      success: true,
      message: "Record backed up and deleted successfully",
      data: result,
    });
  });
};

module.exports = {
  createMasterDetail,
  getSingleMdetail,
  createOrUpdateMasterData,
  getFueltypeMdetail,
  getPreviousReadings,
  getPrevReadingData,
  getSingleMdetaildata,
  updateMasterSingleDetail,
  MDetailBackupDelete,
};
