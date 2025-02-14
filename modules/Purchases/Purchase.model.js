const db = require("../../config/db.js");
const dotenv = require("dotenv");

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

module.exports = {
  createPurchaseRate,
  getAllPurchaseRate,
};
