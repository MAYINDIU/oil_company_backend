const connection = require("../../config/db.js");

exports.create = (newUser, callback) => {
  const sql = "INSERT INTO shabaka_data SET ?";
  connection.query(sql, newUser, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result.insertId);
  });
};

exports.getAll = (station, fromDate, toDate, callback) => {
  const query = `
      SELECT 
          s.id,
          s.tr_date,
          s.station_id,
          s.shabaka_id,
          s.amount,
          s.remarks,
          s.created_at,
          br.branch_name,
          shaba.shabaka_no
      FROM shabaka_data s
      JOIN branch br ON s.station_id = br.branch_id
      JOIN shabaka shaba ON s.shabaka_id = shaba.id
      WHERE s.station_id = ? AND s.tr_date >= ? AND s.tr_date <= ?
      ORDER BY br.branch_name ASC
  `;

  const params = [station, fromDate, toDate];

  connection.query(query, params, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

exports.getById = (id, callback) => {
  const sql = "SELECT * FROM shabaka_data WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.update = (id, updateData, callback) => {
  const sql = "UPDATE shabaka_data SET ? WHERE id = ?";
  connection.query(sql, [updateData, id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};

exports.delete = (id, callback) => {
  const sql = "DELETE FROM shabaka_data WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};
