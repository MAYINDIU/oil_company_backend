const db = require("../../config/db.js");

function getAllOtherExpItem(callback) {
  db.query("SELECT * FROM others_exp_item ", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function createOthExpenseItem(expenseItem, callback) {
  // Fix the variable name from `error` to `err`
  db.query(
    "INSERT INTO others_exp_item  SET ?",
    expenseItem,
    (err, results) => {
      if (err) {
        // Fix the variable name from `err` to `error`
        callback(err, null);
        return;
      } else {
        callback(null, results);
      }
    }
  );
}

function updateOthersExpitem(other_exp_id, data, callback) {
  const updateQuery =
    "UPDATE others_exp_item  SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    " WHERE other_exp_id    = ?";
  const updateValues = [...Object.values(data), other_exp_id];
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
  getAllOtherExpItem,
  createOthExpenseItem,
  updateOthersExpitem,
};
