
// suplier.js
const db = require("../config/index.js");
const dotenv = require("dotenv");

function getAllCategory(callback) {
    db.query("SELECT * FROM category ", (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }

function createCategory(user, callback) {
    // Fix the variable name from `error` to `err`
    db.query("INSERT INTO category  SET ?", user, (err, results) => {
      if (err) {
        // Fix the variable name from `err` to `error`
        callback(err, null);
        return;
      } else {
        callback(null, results);
      }
    });
  }


function updateCategory(category_id , data, callback) {
    const updateQuery =
      "UPDATE category  SET " +
      Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ") +
      " WHERE category_id  = ?";
    const updateValues = [...Object.values(data), category_id ];
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
    createCategory,
    getAllCategory,
    updateCategory
  };





