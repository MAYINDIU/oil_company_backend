// userModel.js
const db = require("../config/index.js");
const dotenv = require("dotenv");

function getAllUsers(callback) {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function getUser(id, callback) {
  db.query("SELECT * FROM users WHERE id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}


function getUserByEmail(email, callback) {
  db.query("SELECT * FROM users WHERE email = ? ", email, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}


function createUser(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO users SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

function updateUser(id, data, callback) {
  const updateQuery =
    "UPDATE users SET " +
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

const changePassword = (id, password) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE users SET ? WHERE id =?`,
      [{ password }, id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};
module.exports = {
  getAllUsers,
  getUser,
  getUserByEmail,
  createUser,
  changePassword,
  updateUser,
};
