// suplier.js
const db = require("../config/db");
const dotenv = require("dotenv");

function getAllToromba(callback) {
    const query = `
        SELECT 
            t.toromba_id,
            t.station_id,
            t.fuel_type,
            t.torombo_no,
            t.torombo_op_b,
            t.torombo_close_balance,
            t.created_date,
            t.updated_date,
            b.branch_name
        FROM toromba t
        LEFT JOIN branch b ON t.station_id = b.branch_id `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching toromba data:", err);
            return callback(err, null);
        }
        callback(null, results);
    });
}



function getSingleStationwiseToromba(station_id, callback) {
    const query = `
        SELECT 
            t.toromba_id,
            t.station_id,
            t.fuel_type,
            t.torombo_no,
            t.torombo_op_b,
            t.torombo_close_balance,
            t.created_date,
            t.updated_date,
            b.branch_name
        FROM toromba t
        LEFT JOIN branch b ON t.station_id = b.branch_id
        WHERE t.station_id = ?`; // Using ? as a placeholder

    db.query(query, [station_id], (err, results) => {
        if (err) {
            console.error("Error fetching toromba data:", err);
            return callback(err, null);
        }
        callback(null, results);
    });
}






function createToromba(toromba, callback) {
    // Fix the variable name from `error` to `err`
    db.query("INSERT INTO toromba  SET ?", toromba, (err, results) => {
      if (err) {
        // Fix the variable name from `err` to `error`
        callback(err, null);
        return;
      } else {
        callback(null, results);
      }
    });
  }


function updateToromba(toromba_id , data, callback) {
    const updateQuery =
      "UPDATE toromba  SET " +
      Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ") +
      " WHERE toromba_id  = ?";
    const updateValues = [...Object.values(data), toromba_id ];
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
    createToromba,
    getAllToromba,
    updateToromba,
    getSingleStationwiseToromba
  };





