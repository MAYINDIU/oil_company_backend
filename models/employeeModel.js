// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all employees
function getAllemployees(callback) {
  db.query("SELECT * FROM employees LEFT JOIN position ON position.id = employees.position_id LEFT JOIN department ON department.id = employees.department_id", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


//Create a new employees
function createEmployees(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO employees SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

//update employees
function updateemployees(id, data, callback) {
  const updateQuery =
    "UPDATE employees SET " +
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

//delete employees
const removeemployees = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM employees WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


//get a single EMPLOYEE
function getSingleEmployee(id, callback) {
  const query = `
    SELECT employees.*, department.* 
    FROM employees 
    LEFT JOIN department ON department.id = employees.department_id 
    WHERE employees.employee_id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}



module.exports = {
  getAllemployees,
  createEmployees,
  updateemployees,
  removeemployees,
  getSingleEmployee
};
