const db = require("../../config/db.js");

exports.createUser = (newUser, callback) => {
  const sql = "INSERT INTO users SET ?";
  db.query(sql, newUser, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result.insertId);
  });
};

exports.getAllUsers = (callback) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

exports.getUserById = (id, callback) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.getUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.updateUser = (id, updatedUser, callback) => {
  const sql = "UPDATE users SET ? WHERE id = ?";
  db.query(sql, [updatedUser, id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};

exports.changePassword = (id, password, callback) => {
  const sql = "UPDATE users SET password = ? WHERE id = ?";
  db.query(sql, [password, id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result.affectedRows);
  });
};

exports.deleteUser = (id, callback) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};
