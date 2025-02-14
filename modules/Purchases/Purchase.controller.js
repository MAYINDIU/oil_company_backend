const ApiError = require("../../errors/APIError");
const purchaserateModel = require("./Purchase.model");
const sendResponse = require("../../utilities/sendResponse");




const getStationwiseLedgerreport = (req, res) => {
  const { from_date, to_date, station_id } = req.query;

  purchaserateModel.getStationwiseLedger(from_date, to_date, station_id, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to fetch ledger report" });
    }

    // Process the result to group and aggregate the data by tr_date
    const processedData = result.reduce((acc, row) => {
      const { tr_date, fuel_type, total_qty, total_amt, station_name } = row;

      // Ensure tr_date is handled correctly in UTC by creating a UTC date object
      const dateObj = new Date(tr_date);

      // Add 1 day to the date
      dateObj.setDate(dateObj.getDate() + 1);

      // Manually format the date as 'DD-MM-YYYY'
      const day = String(dateObj.getUTCDate()).padStart(2, '0');  // Ensure 2-digit day
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');  // Ensure 2-digit month
      const year = dateObj.getUTCFullYear();

      const dateKey = `${day}-${month}-${year}`;  // Format as 'DD-MM-YYYY'

      // If the date is not yet in the accumulator, initialize it
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          station_name, // Add the station_name here
          qty91: 0,
          amount91: 0,
          qty95: 0,
          amount95: 0,
          qtyDiesel: 0,
          amountDiesel: 0,
          totalAmount: 0,
          total_quantity: 0 // Initialize the total quantity
        };
      }

      // Aggregate the data by fuel type
      switch (fuel_type) {
        case "91":
          acc[dateKey].qty91 += total_qty;
          acc[dateKey].amount91 += total_amt;
          break;
        case "95":
          acc[dateKey].qty95 += total_qty;
          acc[dateKey].amount95 += total_amt;
          break;
        case "Diesel":
          acc[dateKey].qtyDiesel += total_qty;
          acc[dateKey].amountDiesel += total_amt;
          break;
        default:
          break;
      }

      // Aggregate total amount
      acc[dateKey].totalAmount += total_amt;

      // Calculate the total quantity (sum of qty91, qty95, and qtyDiesel)
      acc[dateKey].total_quantity = acc[dateKey].qty91 + acc[dateKey].qty95 + acc[dateKey].qtyDiesel;

      // Calculate the rate (totalAmount / total_quantity), if total_quantity is not 0
      if (acc[dateKey].total_quantity > 0) {
        acc[dateKey].rate = (acc[dateKey].totalAmount / acc[dateKey].total_quantity).toFixed(2);
      } else {
        acc[dateKey].rate = 0; // Avoid division by zero
      }

      return acc;
    }, {});

    // Convert the object into an array
    const resultArray = Object.values(processedData);

    // Send the processed result as the response
    res.status(200).json({
      success: true,
      data: resultArray,
    });
  });
};




const getLedgerReport = (req, res) => {
  const { from_date, to_date, supplier_id } = req.query;

  purchaserateModel.getSupplierwiseLedger(from_date, to_date, supplier_id, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to fetch ledger report" });
    }

    // Process the result to group and aggregate the data by tr_date
    const processedData = result.reduce((acc, row) => {
      const { tr_date, fuel_type, total_qty, total_amt, supplier_name } = row;

      // Ensure tr_date is handled correctly in UTC by creating a UTC date object
      const dateObj = new Date(tr_date);

      // Add 1 day to the date
      dateObj.setDate(dateObj.getDate() + 1);

      // Manually format the date as 'DD-MM-YYYY'
      const day = String(dateObj.getUTCDate()).padStart(2, '0');  // Ensure 2-digit day
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');  // Ensure 2-digit month
      const year = dateObj.getUTCFullYear();

      const dateKey = `${day}-${month}-${year}`;  // Format as 'DD-MM-YYYY'

      // If the date is not yet in the accumulator, initialize it
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          supplier_name, // Add the supplier_name here
          qty91: 0,
          amount91: 0,
          qty95: 0,
          amount95: 0,
          qtyDiesel: 0,
          amountDiesel: 0,
          totalAmount: 0
        };
      }

      // Aggregate the data by fuel type
      switch (fuel_type) {
        case "91":
          acc[dateKey].qty91 += total_qty;
          acc[dateKey].amount91 += total_amt;
          break;
        case "95":
          acc[dateKey].qty95 += total_qty;
          acc[dateKey].amount95 += total_amt;
          break;
        case "Diesel":
          acc[dateKey].qtyDiesel += total_qty;
          acc[dateKey].amountDiesel += total_amt;
          break;
        default:
          break;
      }

      // Aggregate total amount
      acc[dateKey].totalAmount += total_amt;

      return acc;
    }, {});

    // Convert the object into an array
    const resultArray = Object.values(processedData);

    // Send the processed result as the response
    res.status(200).json({
      success: true,
      data: resultArray,
    });
  });
};



const getTotalExpensebystation = (req, res) => {
  const { station_id, tr_date } = req.params; // Get the station_id from the request parameters

  purchaserateModel.getTotalPurchaseByStation(
    station_id,
    tr_date,

    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to fetch total purchase" });
      }
      res.status(201).json({
        success: true,
        data: result,
      });
    }
  );
};

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
      tr_date,
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
      tr_date,
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

const updatePurchase = async (req, res) => {
  const { id } = req.params;

  const { ...data } = req.body;
  // console.log(id, data);
  purchaserateModel.updatePurchase(id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Purchase updated successfully",
        data: user,
      });
    }
  });
};

module.exports = {
  createPurchaseRate,
  getAllPurchaseData,
  updatePurchase,
  getTotalExpensebystation,
  getLedgerReport,
  getStationwiseLedgerreport
};
