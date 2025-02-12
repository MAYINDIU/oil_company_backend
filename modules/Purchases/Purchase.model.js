const db = require("../../config/db.js");
const dotenv = require("dotenv");

// const getTotalPurchaseByStation = (
//   station_id,
//   tr_date,
//   fuel_type,
//   callback
// ) => {
//   const query = `SELECT
//     b.branch_id,
//     b.branch_name,
//     SUM(pr.total_qty) AS total_quantity,
//     SUM(pr.total_amt) AS total_amount,
//     SUM(pr.no_truck) AS total_trucks
// FROM purchase_rate pr
// JOIN branch b ON pr.station_id = b.branch_id
// WHERE
//     pr.station_id = ?
//     AND pr.tr_date = ?
//     AND pr.fuel_type = ?
// GROUP BY b.branch_id, b.branch_name`;

//   db.query(query, [station_id, tr_date, fuel_type], (err, result) => {
//     if (err) {
//       console.error("Error fetching total expense:", err);
//       return callback(err, null);
//     }
//     callback(null, result);
//   });
// };

const getTotalPurchaseByStation = (station_id, tr_date, callback) => {
  const query = `SELECT 
    pr.fuel_type,
    SUM(pr.total_qty) AS total_quantity, 
    SUM(pr.total_amt) AS total_amount, 
    SUM(pr.no_truck) AS total_trucks
FROM purchase_rate pr
WHERE 
    pr.station_id = ? 
    AND pr.tr_date = ? 
GROUP BY pr.fuel_type
ORDER BY pr.fuel_type`;

  db.query(query, [station_id, tr_date], (err, result) => {
    if (err) {
      console.error("Error fetching total expense:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

function createPurchaseRate(PurchaseRate, callback) {
  db.query("INSERT INTO purchase_rate  SET ?", PurchaseRate, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

const getAllPurchaseRate = (callback) => {
  const query = `
        SELECT 
            pr.*, 
            b.branch_name, 
            s.supplier_name
        FROM purchase_rate pr
        LEFT JOIN branch b ON pr.station_id = b.branch_id
        LEFT JOIN suppliers s ON pr.supplier_id = s.supplier_id
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching purchase rate data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

function updatePurchase(id, data, callback) {
  const updateQuery =
    "UPDATE purchase_rate SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    " WHERE id = ?";
  const updateValues = [...Object.values(data), id];
  // console.log("User Service", updateQuery, updateValues);
  db.query(updateQuery, updateValues, (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

module.exports = {
  createPurchaseRate,
  getAllPurchaseRate,
  updatePurchase,
  getTotalPurchaseByStation,
};
