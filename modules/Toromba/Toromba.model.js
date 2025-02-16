const db = require("../../config/db.js");

// function getAllToromba(station_id,fuel_type,callback) {
//   const query = `
//         SELECT
//             t.toromba_id,
//             t.station_id,
//             t.rate,
//             t.fuel_type,
//             t.torombo_no,
//             t.torombo_op_b,
//             t.torombo_close_balance,
//             t.created_date,
//             t.updated_date,
//             b.branch_name
//         FROM toromba t
//          JOIN branch b ON t.station_id = b.branch_id order by  b.branch_name,t.fuel_type, t.torombo_no ASC`;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching toromba data:", err);
//       return callback(err, null);
//     }
//     callback(null, results);
//   });
// }

function getAllToromba(station_id, fuel_type, callback) {
  let query = `
      SELECT 
          t.toromba_id,
          t.station_id,
          t.rate,
          t.fuel_type,
          t.torombo_no,
          t.torombo_op_b,
          t.torombo_close_balance,
          t.created_date,
          t.updated_date,
          b.branch_name
      FROM toromba t
      JOIN branch b ON t.station_id = b.branch_id
      WHERE 1=1
      ${station_id ? "AND t.station_id = ?" : ""}
      ${fuel_type ? "AND t.fuel_type = ?" : ""}
      ORDER BY b.branch_name, t.fuel_type, t.torombo_no ASC
  `;

  const params = [];
  if (station_id) params.push(station_id);
  if (fuel_type) params.push(fuel_type);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching toromba data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
}

function getSingleStationwiseToromba(station_id, fuel_type, callback) {
  const query = `
        SELECT 
            t.toromba_id,
            t.station_id,
            t.fuel_type,
            t.rate,
            t.torombo_no,
            t.torombo_op_b,
            t.torombo_close_balance,
            t.created_date,
            t.updated_date,
            b.branch_name
        FROM toromba t
        LEFT JOIN branch b ON t.station_id = b.branch_id
        WHERE t.station_id = ? AND t.fuel_type = ?`;
  db.query(query, [station_id, fuel_type], (err, results) => {
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

function updateToromba(toromba_id, data, callback) {
  const sql = "UPDATE toromba SET ? WHERE toromba_id = ?";
  db.query(sql, [data, toromba_id], (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

function deleteToromba(id, callback) {
  const sql = "DELETE FROM toromba WHERE toromba_id = ?";
  db.query(sql, [id], (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, rows.affectedRows);
  });
}

function getToromboRate(station_id, fuel_type, torombo_no, callback) {
  const query = `
        SELECT 
            rate
        FROM toromba 
        WHERE station_id = ? AND fuel_type = ? AND torombo_no=?`; // Adding fuel_type filter

  db.query(query, [station_id, fuel_type, torombo_no], (err, results) => {
    if (err) {
      console.error("Error fetching toromba data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
}

module.exports = {
  getToromboRate,
  createToromba,
  getAllToromba,
  updateToromba,
  deleteToromba,
  getSingleStationwiseToromba,
};
