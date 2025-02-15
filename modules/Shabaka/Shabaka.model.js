const connection = require("../../config/db.js");

exports.create = (newUser, callback) => {
  const sql = "INSERT INTO shabaka SET ?";
  connection.query(sql, newUser, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result.insertId);
  });
};

// exports.getAll = (callback) => {
//   const sql = "SELECT * FROM shabaka ";
//   connection.query(sql, (err, results) => {
//     if (err) {
//       callback(err, null);
//       return;
//     }
//     callback(null, results);
//   });
// };

exports.getAll = (station, callback) => {
  const query = `
      SELECT 
          s.id,
          s.station_id,
          s.shabaka_no,
          s.remarks,
          s.bank_name,
          s.created_at,
          br.branch_name,
          b.name as bank
      FROM shabaka s
      JOIN branch br ON s.station_id = br.branch_id
      JOIN banklist b ON s.bank_name = b.id
      WHERE 1=1
      ${station ? "AND s.station_id = ?" : ""}
      ORDER BY br.branch_name, s.shabaka_no ASC
  `;

  const params = [];
  if (station) params.push(station);

  connection.query(query, params, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

exports.getById = (id, callback) => {
  const sql = "SELECT * FROM shabaka WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.update = (id, updateData, callback) => {
  const sql = "UPDATE shabaka SET ? WHERE id = ?";
  connection.query(sql, [updateData, id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};

exports.delete = (id, callback) => {
  const sql = "DELETE FROM shabaka WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results.affectedRows);
  });
};
