// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all salary
function getAllsalary(callback) {
  db.query("SELECT * FROM salary", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


// Create a new salary
function createsalary(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO salary SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}



//update salary
function updatesalary(id, data, callback) {
  const updateQuery =
    "UPDATE salary SET " +
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

//delete salary
const removesalary = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM salary WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


//get a single EMPLOYEE
function getSinglesalary(id, callback) {
  db.query("SELECT * FROM salary WHERE employee_id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}


module.exports = {
  getAllsalary,
  createsalary,
  updatesalary,
  removesalary,
  getSinglesalary
};
