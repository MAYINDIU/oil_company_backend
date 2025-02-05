const db = require("../../config/db.js");

function getAllBranch(callback) {
  db.query("SELECT * FROM branch ", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function createBranch(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO branch  SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

function updateBranch(branch_id, data, callback) {
  const updateQuery =
    "UPDATE branch  SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    " WHERE branch_id  = ?";
  const updateValues = [...Object.values(data), branch_id];
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
  createBranch,
  getAllBranch,
  updateBranch,
};
