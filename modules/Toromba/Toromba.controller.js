const ApiError = require("../../errors/APIError");
const torombaModel = require("./Toromba.model");
const sendResponse = require("../../utilities/sendResponse");

const createToromba = async (req, res) => {
  try {
    const {
      station_id,
      fuel_type,
      torombo_no,
      torombo_op_b,
      torombo_close_balance,
      rate,
    } = req.body;

    torombaModel.getAllToromba(station_id, fuel_type, (err, toromba) => {
      const exists = toromba?.find(
        (d) =>
          d?.station_id == station_id &&
          d?.fuel_type == fuel_type &&
          d?.torombo_no == torombo_no
      );
      if (exists) {
        return res.status(400).json({ error: "Already exists this toromba" });
      }

      const saveData = {
        station_id,
        fuel_type,
        torombo_no,
        torombo_op_b,
        torombo_close_balance,
        rate,
      };
      torombaModel.createToromba(saveData, (err, result) => {
        if (err) {
          console.error("Error inserting Toromba data:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({
          success: true,
          message: "Toromba created successfully",
          torombaId: result.insertId, // Ensure your model returns `insertId`
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

function getAllToromba(req, res) {
  const { station_id, fuel_type } = req.query;
  torombaModel.getAllToromba(station_id, fuel_type, (err, toromba) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all Toromba successfully",
        data: toromba,
      });
    }
  });
}

const getSingleStationwiseToromba = (req, res) => {
  const { station_id, fuel_type } = req.query; // Get parameters from query string

  if (!station_id || !fuel_type) {
    return res
      .status(400)
      .json({ error: "Both station_id and fuel_type are required" });
  }

  torombaModel.getSingleStationwiseToromba(
    station_id,
    fuel_type,
    (err, results) => {
      if (err) {
        console.error("Error fetching toromba data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "No toromba records found for this station and fuel type",
        });
      }

      res.status(200).json(results);
    }
  );
};

const updateToromba = async (req, res) => {
  const { toromba_id } = req.params;

  const { ...data } = req.body;
  // console.log(id, data);
  torombaModel.updateToromba(toromba_id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Toromba updated successfully",
        data: user,
      });
    }
  });
};

const deleteTorombaById = async (req, res) => {
  const { id } = req.params;
  torombaModel.deleteToromba(id, (err, affectedRows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to delete Data", error: err?.sqlMessage });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ message: "Data deleted successfully" });
  });
};

const getToromboRate = (req, res) => {
  const { station_id, fuel_type, torombo_no } = req.query; // Get parameters from query string

  torombaModel.getToromboRate(
    station_id,
    fuel_type,
    torombo_no,
    (err, results) => {
      if (err) {
        console.error("Error fetching toromba rate:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!results || results.length === 0) {
        return res.status(200).json({ rate: 0 }); // Return rate 0 instead of 404
      }

      res.status(200).json(results);
    }
  );
};

module.exports = {
  createToromba,
  getAllToromba,
  updateToromba,
  deleteTorombaById,
  getSingleStationwiseToromba,
  getToromboRate,
};
