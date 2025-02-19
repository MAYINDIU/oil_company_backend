const db = require("../../config/db.js");
const dotenv = require("dotenv");

const getStationwiseLedger = (from_date, to_date, station_id, callback) => {
  const query = `SELECT
    pr.tr_date,
    pr.fuel_type,
    SUM(pr.total_qty) AS total_qty,
    SUM(pr.total_amt) AS total_amt,
    MAX(b.branch_name) AS station_name,
    MAX(s.supplier_name) AS supplier_name
FROM purchase_rate pr
JOIN branch b ON b.branch_id = pr.station_id
JOIN suppliers s ON s.supplier_id = pr.supplier_id
WHERE pr.tr_date BETWEEN ? AND ?
AND pr.station_id = ?
GROUP BY pr.tr_date, pr.fuel_type
ORDER BY pr.tr_date, pr.fuel_type`;

  db.query(query, [from_date, to_date, station_id], (err, result) => {
    if (err) {
      console.error("Error fetching total expense:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getSupplierwiseLedger = (from_date, to_date, supplier_id, callback) => {
  const query = ` SELECT
      pr.total_qty,
      pr.total_amt,
      pr.fuel_type,
      pr.tr_date,
      b.branch_name AS station_name,
      s.supplier_name
  FROM purchase_rate pr
  JOIN branch b ON b.branch_id = pr.station_id
  JOIN suppliers s ON s.supplier_id = pr.supplier_id
  WHERE pr.tr_date BETWEEN ? AND ?
  AND pr.supplier_id = ?`;

  db.query(query, [from_date, to_date, supplier_id], (err, result) => {
    if (err) {
      console.error("Error fetching total expense:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getTotalPurchaseByStation = (station_id, tr_date, callback) => {
  const query = `SELECT
    MAX(pr.id) AS id, 
    pr.tr_date,
    pr.fuel_type,
    SUM(pr.total_qty) AS total_quantity,
    SUM(pr.total_amt) AS total_amount,
    SUM(pr.no_truck) AS total_trucks,
    MAX(b.branch_id) AS branch_id,
    MAX(b.branch_name) AS branch_name,
    MAX(s.supplier_id) AS supplier_id,
    MAX(s.supplier_name) AS supplier_name
FROM purchase_rate pr
LEFT JOIN branch b ON pr.station_id = b.branch_id
LEFT JOIN suppliers s ON pr.supplier_id = s.supplier_id
WHERE
    pr.station_id = ?  
    AND pr.tr_date = ?  
GROUP BY 
    pr.fuel_type, pr.tr_date
ORDER BY 
    pr.fuel_type`;

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
ORDER BY pr.station_id, b.branch_id,pr.fuel_type`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching purchase rate data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getStationwisePurchaseList = (station_id, tr_date, callback) => {
  const query = `SELECT 
      pr.id,
      pr.tr_date,
      pr.fuel_type, 
      pr.no_truck AS total_trucks,
      pr.total_qty AS total_quantity,
      pr.total_amt AS total_amount,
      b.branch_id,
      s.supplier_id,
      b.branch_name, 
      s.supplier_name
  FROM purchase_rate pr
  LEFT JOIN branch b ON pr.station_id = b.branch_id
  LEFT JOIN suppliers s ON pr.supplier_id = s.supplier_id
  WHERE pr.tr_date = ? 
  AND pr.station_id = ?`;

  db.query(query, [tr_date, station_id], (err, result) => {
    if (err) {
      console.error("Error fetching purchase list:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

function updatePurchase(id, data, callback) {
  const updateQuery =
    "UPDATE purchase_rate SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    ", updated_date = NOW() WHERE id = ?";

  const updateValues = [...Object.values(data), id];

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
  getSupplierwiseLedger,
  getStationwisePurchaseList,
  getStationwiseLedger,
};

// 1. getTotalPurchaseByStation
// const query = `SELECT
//    pr.id,
//     pr.tr_date,
//     pr.fuel_type,
//     SUM(pr.total_qty) AS total_quantity,
//     SUM(pr.total_amt) AS total_amount,
//     SUM(pr.no_truck) AS total_trucks,
//     b.branch_id,
//     b.branch_name,
//     s.supplier_id,
//     s.supplier_name
//     FROM purchase_rate pr
//     LEFT JOIN branch b ON pr.station_id = b.branch_id
//     LEFT JOIN suppliers s ON pr.supplier_id = s.supplier_id
//     WHERE
//         pr.station_id = ?
//         AND pr.tr_date = ?
//     GROUP BY
//         pr.fuel_type, b.branch_name, pr.station_id, s.supplier_name
//     ORDER BY
//         pr.fuel_type`;

// 2. getSupplierwiseLedger
// const query = `SELECT
// pr.tr_date,
// pr.fuel_type,
// SUM(pr.total_qty) AS total_qty,
// SUM(pr.total_amt) AS total_amt,
// b.branch_name AS station_name,
// s.supplier_name
// FROM purchase_rate pr
// JOIN branch b ON b.branch_id = pr.station_id
// JOIN suppliers s ON s.supplier_id = pr.supplier_id
// WHERE pr.tr_date BETWEEN ? AND ?
// AND pr.station_id = ?
// GROUP BY pr.tr_date, pr.fuel_type
// ORDER BY pr.tr_date, pr.fuel_type`;
