// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all position
function getAllposition(callback) {
  db.query("SELECT * FROM position", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


//Create a new position
function createPosition(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO position SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

//get a single position
function getSinglePosition(id, callback) {
  db.query("SELECT * FROM position WHERE id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}

//update position
function updatePosition(id, data, callback) {
  const updateQuery =
    "UPDATE position SET " +
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

//delete position
const removePosition = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM position WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


module.exports = {
  getAllposition,
  createPosition,
  updatePosition,
  removePosition,
  getSinglePosition
};
