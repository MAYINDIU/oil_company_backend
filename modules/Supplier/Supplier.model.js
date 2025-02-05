const db = require("../../config/db.js");

function getAllSuppliers(callback) {
  db.query("SELECT * FROM suppliers", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

function createSupplier(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO suppliers SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

function updateSupplier(supplier_id, data, callback) {
  const updateQuery =
    "UPDATE suppliers SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    " WHERE supplier_id = ?";
  const updateValues = [...Object.values(data), supplier_id];
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
  createSupplier,
  getAllSuppliers,
  updateSupplier,
};
