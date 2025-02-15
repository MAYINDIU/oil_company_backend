const db = require("../../config/db.js");

const getTotalExpenseByStation = (station_id, exp_date, callback) => {
  const query = `SELECT COALESCE(SUM(amount), 0) AS total_expense 
                 FROM station_expense 
                 WHERE station_id = ? 
                 AND tr_date = ?`;

  db.query(query, [station_id, exp_date], (err, result) => {
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



//station and date wise all expense list
function getAllstationExpensebystationDate(station_id,tr_date, callback) {
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
    WHERE station_expense.station_id = ? AND station_expense.tr_date=?
  `;

  db.query(query, [station_id,tr_date], (err, results) => {
    if (err) {
      callback(err, null);
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
  getAllstationExpensebystationDate
};
