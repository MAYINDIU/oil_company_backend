const connection = require("../../../config/db");

exports.create = (newUser, callback) => {
  const sql = "INSERT INTO banklist SET ?";
  connection.query(sql, newUser, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result.insertId);
  });
};

exports.getAll = (callback) => {
  const sql = "SELECT * FROM banklist ";
  connection.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

exports.getById = (id, callback) => {
  const sql = "SELECT * FROM banklist WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.update = (id, updateData, callback) => {
  const sql = "UPDATE banklist SET ? WHERE id = ?";
  connection.query(sql, [updateData, id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};

exports.delete = (id, callback) => {
  const sql = "DELETE FROM banklist WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};
