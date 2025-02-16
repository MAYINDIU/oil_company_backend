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



function getAllOtherExpensebystationDate(station_id,tr_date, callback) {
  const query = `
    SELECT 
       others_exp.tr_date,
      others_exp.other_expe_id,
      others_exp.station_id,
      branch.branch_name,
      expense_item.exp_id,
      expense_item.expense_name,
      others_exp.amount,
      others_exp.remarks,
      others_exp.created_date,
      others_exp.updated_date
    FROM others_exp
    JOIN branch ON others_exp.station_id = branch.branch_id
    JOIN expense_item ON others_exp.other_expitem_id = expense_item.exp_id
    WHERE others_exp.station_id = ? AND others_exp.tr_date=?
  `;

  db.query(query, [station_id,tr_date], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


function getOthersSingleExpense(other_expe_id , callback) {
  const query = `
     SELECT 
       others_exp.tr_date,
      others_exp.other_expe_id,
      others_exp.station_id,
      branch.branch_name,
      expense_item.expense_name,
      others_exp.amount,
      others_exp.remarks,
      others_exp.created_date,
      others_exp.updated_date
    FROM others_exp
    JOIN branch ON others_exp.station_id = branch.branch_id
    JOIN expense_item ON others_exp.other_expitem_id = expense_item.exp_id
    WHERE others_exp.other_expe_id = ?
  `;

  db.query(query, [other_expe_id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}



const updateSingleExpense = (data, callback) => {
  const { other_expe_id, station_id, other_expitem_id, amount, remarks, tr_date } = data;

  const query = `
    UPDATE others_exp 
    SET 
      station_id = ?, 
      other_expitem_id = ?, 
      amount = ?, 
      remarks = ?, 
      tr_date = ?, 
      updated_date = NOW() 
    WHERE other_expe_id = ?
  `;

  const values = [station_id, other_expitem_id, amount, remarks, tr_date, other_expe_id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating others station expense data:", err);
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = {
  createExpenseamount,
  getTotalExpenseByStation,
  getAllOtherExpensebystationDate,
  getOthersSingleExpense,
  updateSingleExpense
};
