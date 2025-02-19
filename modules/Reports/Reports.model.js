const db = require("../../config/db.js");

//  master summary report

const getSummaryDetails = (station_id, tr_date, callback) => {
  const query = `SELECT 
    ms.*, 
    md.fuel_type,
    md.torambo_no,
    md.previous_reading,
    md.present_reading,
    md.sale_unit,
    md.addition,
    md.tr_date,
    b.branch_name  
FROM master_summary ms
LEFT JOIN m_detail md 
    ON ms.station_id = md.station_id 
    AND ms.tr_date = md.tr_date
LEFT JOIN branch b
    ON md.station_id = b.branch_id  
WHERE ms.station_id = ? 
AND ms.tr_date = ?
ORDER BY md.torambo_no ASC
  `;

  db.query(query, [station_id, tr_date], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const dailySalesReport = (tr_date, callback) => {
  const query = `SELECT 
    ms.total_sales_price sales_cash, 
    ms.t_online_payment sales_bank,
    (ms.total_sales_price + ms.t_online_payment) AS sales_total,
    ms.previous_cash sales_op_due,
    ms.cash_sent_ho sales_rcv_cash,
    ms.expense_add sales_exp,
    ms.available_cash sales_cur_due,
    (ms.previous_cash + ms.available_cash) AS sales_total_dues,
    b.branch_name  
    FROM master_summary ms
    LEFT JOIN branch b ON ms.station_id = b.branch_id  
    WHERE ms.tr_date = ?
    ORDER BY b.branch_name ASC
  `;

  db.query(query, [tr_date], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const dailyStockReport = (tr_date, callback) => {
  const query = `SELECT 
    (ms.previous_patrol_95 + ms.previous_patrol_91 + ms.previous_diesel) AS stock_op_balc,
    (ms.add_patrol_95 + ms.add_patrol_91 + ms.add_diesel) AS stock_addition,
    (ms.previous_patrol_95 + ms.previous_patrol_91 + ms.previous_diesel +
    ms.add_patrol_95 + ms.add_patrol_91 + ms.add_diesel) AS stock_total,
    (ms.t_sale_95 + ms.t_sale_91 + ms.t_sale_diesel) AS stock_sales,
    (ms.adjustment_95 + ms.adjustment_91 + ms.adjustment_diesel) AS stock_loss,
    ((ms.previous_patrol_95 + ms.previous_patrol_91 + ms.previous_diesel +
    ms.add_patrol_95 + ms.add_patrol_91 + ms.add_diesel) - 
    (ms.t_sale_95 + ms.t_sale_91 + ms.t_sale_diesel +
    ms.adjustment_95 + ms.adjustment_91 + ms.adjustment_diesel)) AS stock_closing,
    b.branch_name  
    FROM master_summary ms
    LEFT JOIN branch b ON ms.station_id = b.branch_id  
    WHERE ms.tr_date = ?
    ORDER BY b.branch_name ASC
  `;

  db.query(query, [tr_date], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const dailyPartyReport = (tr_date, callback) => {
  const query = `
  SELECT 
    SUM(pu.total_amt) AS purchase_amt,  
    b.branch_name AS branch_name,
    s.supplier_name AS supplier,
    s.supplier_id  
FROM purchase_rate pu
LEFT JOIN branch b ON pu.station_id = b.branch_id
LEFT JOIN suppliers s ON pu.supplier_id = s.supplier_id  
WHERE pu.tr_date = ?
GROUP BY b.branch_id, s.supplier_id 
ORDER BY s.supplier_name,b.branch_name ASC;
  `;

  db.query(query, [tr_date], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  getSummaryDetails,
  dailySalesReport,
  dailyStockReport,
  dailyPartyReport,
};
