// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all leave_types
function getAllleave_types(callback) {
  db.query("SELECT * FROM leave_types", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


//Create a new leave_types
function createleave_types(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO leave_types SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

//get a single leave_types
function getSingleleave_types(id, callback) {
  db.query("SELECT * FROM leave_types WHERE id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}

//update leave_types
function updateleave_types(id, data, callback) {
  const updateQuery =
    "UPDATE leave_types SET " +
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

//delete leave_types
const removeleave_types = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM leave_types WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


module.exports = {
  getAllleave_types,
  createleave_types,
  updateleave_types,
  removeleave_types,
  getSingleleave_types
};
