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
    const {
      station_id,
      supplier_id,
      fuel_type,
      no_truck,
      total_qty,
      total_amt,
    } = req.body;

    // Calculate unit_p_rate based on total_qty and total_amt
    const unit_p_rate = total_amt / total_qty;

    // Prepare data for insertion
    const saveData = {
      station_id,
      supplier_id,
      fuel_type,
      no_truck,
      unit_p_rate, // This is now calculated before insertion
      total_qty,
      total_amt,
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
