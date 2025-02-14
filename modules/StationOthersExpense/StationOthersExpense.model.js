const db = require("../../config/db.js");

const getTotalExpenseByStation = (station_id, exp_date, callback) => {
  const query = `SELECT SUM(amount) AS total_expense
FROM others_exp 
WHERE station_id = ?
AND tr_date = ? `;

  db.query(query, [station_id, exp_date], (err, result) => {
    if (err) {
      console.error("Error fetching total expense:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

function createExpenseamount(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO others_exp  SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

module.exports = {
  createExpenseamount,
  getTotalExpenseByStation,
};
