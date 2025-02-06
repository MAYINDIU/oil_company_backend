const ApiError = require("../../errors/APIError");
const purchaserateModel = require("./Purchase.model");
const sendResponse = require("../../utilities/sendResponse");

function getAllPurchaseData(req, res) {
  purchaserateModel.getAllPurchaseRate((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all purchase data successfully",
        data: users,
      });
    }
  });
}

const createPurchaseRate = async (req, res) => {
  try {
    const { station_id, supplier_id, fuel_type, p_rate, quantity_unit } =
      req.body;
    // Prepare data for insertion
    const saveData = {
      station_id,
      supplier_id,
      fuel_type,
      p_rate,
      quantity_unit,
    };

    // Insert into database
    purchaserateModel.createPurchaseRate(saveData, (err, result) => {
      if (err) {
        console.error("Error inserting master detail reading:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({
        success: true,
        message: "Purchase Rate created successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPurchaseRate,
  getAllPurchaseData,
};
