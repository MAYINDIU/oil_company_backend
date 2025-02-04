// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all department
function getAlldepartment(callback) {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


//Create a new department
function createdepartment(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO department SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

//get a single department
function getSingledepartment(id, callback) {
  db.query("SELECT * FROM department WHERE id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}

//update department
function updatedepartment(id, data, callback) {
  const updateQuery =
    "UPDATE department SET " +
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

//delete department
const removedepartment = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM department WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


module.exports = {
  getAlldepartment,
  createdepartment,
  updatedepartment,
  removedepartment,
  getSingledepartment
};
