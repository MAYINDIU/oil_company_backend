const ApiError = require("../../errors/APIError");
const mastersummaryreportModel = require("./Reports.model");
const sendResponse = require("../../utilities/sendResponse");

const getSummaryData = (req, res) => {
  const { station_id, tr_date } = req.query;

  if (!station_id || !tr_date) {
    return res
      .status(400)
      .json({ error: "station_id and tr_date are required" });
  }

  mastersummaryreportModel.getSummaryDetails(
    station_id,
    tr_date,
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(201).json({ message: "No data found" });
      }

      // Extract all summary data
      const summaryData = {
        station_id: results[0].station_id,
        tr_date: results[0].tr_date,
        branch_name: results[0].branch_name,
        total_sale: results[0].total_sale,
        total_expense: results[0].total_expense,
        total_sales_price: results[0].total_sales_price,
        shabaka_payment: results[0].shabaka_payment,
        petro_app_payment: results[0].petro_app_payment,
        others_payment: results[0].others_payment,
        t_online_payment: results[0].t_online_payment,
        // 95 Petrol
        unit_price_95: results[0].unit_price_95,
        t_sale_95: results[0].t_sale_95,
        t_sale_price_95: results[0].t_sale_price_95,
        previous_patrol_95: results[0].previous_patrol_95,
        add_patrol_95: results[0].add_patrol_95,
        extra_purchase_95: results[0].extra_purchase_95,
        sheet_extra_95: results[0].sheet_extra_95,
        cal_extra_95: results[0].cal_extra_95,
        total_stock_95: results[0].total_stock_95,
        // 91 Petrol
        unit_price_91: results[0].unit_price_91,
        t_sale_91: results[0].t_sale_91,
        t_sale_price_91: results[0].t_sale_price_91,
        previous_patrol_91: results[0].previous_patrol_91,
        add_patrol_91: results[0].add_patrol_91,
        extra_purchase_91: results[0].extra_purchase_91,
        sheet_extra_91: results[0].sheet_extra_91,
        cal_extra_91: results[0].cal_extra_91,
        total_stock_91: results[0].total_stock_91,
        // Diesel
        unit_price_diesel: results[0].unit_price_diesel,
        t_sale_diesel: results[0].t_sale_diesel,
        t_sale_price_diesel: results[0].t_sale_price_diesel,
        previous_diesel: results[0].previous_diesel,
        add_diesel: results[0].add_diesel,
        extra_purchase_diesel: results[0].extra_purchase_diesel,
        sheet_extra_diesel: results[0].sheet_extra_diesel,
        cal_extra_diesel: results[0].cal_extra_diesel,
        total_stock_diesel: results[0].total_stock_diesel,
        cash_sent_ho: results[0].cash_sent_ho,
        previous_cash: results[0].previous_cash,
        today_cash: results[0].today_cash,
        available_cash: results[0].available_cash,
        expense_add: results[0].expense_add,
        extra_oil_purchase_cash: results[0].extra_oil_purchase_cash,
        other_expense: results[0].other_expense,
      };

      // Group m_detail by fuel_type
      const groupedDetails = results.reduce((acc, row) => {
        const fuelType = row.fuel_type;
        if (!acc[fuelType]) {
          acc[fuelType] = [];
        }
        acc[fuelType].push({
          torambo_no: row.torambo_no,
          previous_reading: row.previous_reading,
          present_reading: row.present_reading,
          sale_unit: row.sale_unit,
          addition: row.addition,
          tr_date: row.tr_date,
        });
        return acc;
      }, {});

      // Convert grouped data into an array
      const detailsArray = Object.keys(groupedDetails).map((fuelType) => ({
        fuel_type: fuelType,
        records: groupedDetails[fuelType],
      }));

      // Final Response
      res.json({
        summary: summaryData,
        m_detail: detailsArray,
      });
    }
  );
};

module.exports = {
  getSummaryData,
};
