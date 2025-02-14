const db = require("../../config/db.js");

function getAllExpenseItem(callback) {
  db.query("SELECT * FROM expense_item ", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function createExpenseItem(expenseItem, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO expense_item  SET ?", expenseItem, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

function updateExpenseitem(exp_id, data, callback) {
  const updateQuery =
    "UPDATE expense_item  SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    " WHERE exp_id   = ?";
  const updateValues = [...Object.values(data), exp_id];
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
  getAllExpenseItem,
  createExpenseItem,
  updateExpenseitem,
};
