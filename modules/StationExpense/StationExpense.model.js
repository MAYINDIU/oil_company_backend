const db = require("../../config/db.js");

const getTotalExpenseByStation = (station_id, callback) => {
  const query = `
    SELECT 
        se.station_id, 
        se.created_date, 
        ROUND(SUM(se.amount), 0) AS total_expense,
        b.branch_name
    FROM station_expense se
    JOIN branch b ON se.station_id = b.branch_id
    WHERE se.station_id = ? 
    AND se.created_date >= CURDATE()`;

  db.query(query, [station_id], (err, result) => {
    if (err) {
      console.error("Error fetching total expense:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

function getAllstationExpensebystationid(station_id, callback) {
  const query = `
    SELECT 
      station_expense.expense_id,
      station_expense.station_id,
      branch.branch_name,
      station_expense.expitem_id,
      expense_item.expense_name,
      station_expense.amount,
      station_expense.remarks,
      station_expense.created_date,
      station_expense.updated_date
    FROM station_expense
    JOIN branch ON station_expense.station_id = branch.branch_id
    JOIN expense_item ON station_expense.expitem_id = expense_item.exp_id
    WHERE station_expense.station_id = ?
  `;

  db.query(query, [station_id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function getAllstationExpense(callback) {
  const query = `
    SELECT 
      station_expense.expense_id,
      station_expense.station_id,
      branch.branch_name,
      station_expense.expitem_id,
      expense_item.expense_name,
      station_expense.amount,
      station_expense.remarks,
      station_expense.created_date,
      station_expense.updated_date
    FROM station_expense
    JOIN branch ON station_expense.station_id = branch.branch_id
    JOIN expense_item ON station_expense.expitem_id = expense_item.exp_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function createExpenseamount(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO station_expense  SET ?", user, (err, results) => {
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
  getAllstationExpense,
  getAllstationExpensebystationid,
  getTotalExpenseByStation,
};
