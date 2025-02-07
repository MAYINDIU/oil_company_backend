const db = require("../../config/db.js");

// Function to find a record by station_id, fuel_type, and torambo_no
const findByStationFuelTorambo = (
  station_id,
  fuel_type,
  torambo_no,
  callback
) => {
  const query =
    "SELECT previous_reading, sale_unit FROM update_reading WHERE station_id = ? AND fuel_type = ? AND torambo_no = ?";
  db.query(query, [station_id, fuel_type, torambo_no], callback);
};

// Function to update an existing record
const updateMasterData = (
  updatedPreviousReading,
  present_reading,
  sale_unit,
  station_id,
  fuel_type,
  torambo_no,
  callback
) => {
  const query = `
    UPDATE update_reading 
    SET 
      previous_reading = ?, 
      present_reading = ?, 
      sale_unit = ? 
    WHERE 
      station_id = ? 
      AND fuel_type = ? 
      AND torambo_no = ?
  `;
  db.query(
    query,
    [
      updatedPreviousReading,
      present_reading,
      sale_unit,
      station_id,
      fuel_type,
      torambo_no,
    ],
    callback
  );
};

// Function to insert a new record
const insertMasterData = (mDetail, callback) => {
  const query = "INSERT INTO update_reading SET ?";
  db.query(query, mDetail, callback);
};

//  master details entry
function createMasterData(mDetail, callback) {
  db.query("INSERT INTO m_detail  SET ?", mDetail, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

const getFilteredMDetail = (station_id, fuel_type, torambo_no, callback) => {
  const query = `
     SELECT md.*, b.branch_name 
FROM m_detail md
LEFT JOIN branch b ON md.station_id = b.branch_id
WHERE md.station_id = ? 
  AND md.fuel_type = ? 
  AND md.torambo_no = ?
  AND DATE(md.date) = CURDATE()
ORDER BY md.torambo_no ASC, md.date ASC `;

  db.query(query, [station_id, fuel_type, torambo_no], (err, results) => {
    if (err) {
      console.error("Error fetching m_detail data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// const getFueltypeMDetail = (station_id, fuel_type, callback) => {
//   const query = `
//       SELECT md.*, b.branch_name
//       FROM m_detail md
//       LEFT JOIN branch b ON md.station_id = b.branch_id
//       WHERE md.station_id = ?
//         AND md.fuel_type = ?
//         AND DATE(md.date) = CURDATE()
//       ORDER BY md.date ASC,md.torambo_no ASC
//   `;

//   db.query(query, [station_id, fuel_type], (err, results) => {
//     if (err) {
//       console.error("Error fetching m_detail data:", err);
//       return callback(err, null);
//     }
//     callback(null, results);
//   });
// };

const getFueltypeMDetail = (station_id, fuel_type, c_date, callback) => {
  const query = `
      SELECT md.*, b.branch_name 
      FROM m_detail md
      LEFT JOIN branch b ON md.station_id = b.branch_id
      WHERE md.station_id = ? 
        AND md.fuel_type = ? 
        AND DATE(md.date) = ?  -- Replaced CURDATE() with the filter_date placeholder
      ORDER BY md.date ASC, md.torambo_no ASC
  `;

  db.query(query, [station_id, fuel_type, c_date], (err, results) => {
    if (err) {
      console.error("Error fetching m_detail data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getPreviousReading = (station_id, fuel_type, torambo_no, callback) => {
  const query = `SELECT * FROM update_reading WHERE station_id = ? AND fuel_type = ? AND torambo_no = ?`;

  db.query(query, [station_id, fuel_type, torambo_no], (err, results) => {
    if (err) {
      console.error("Error fetching m_detail data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  createMasterData,
  getFilteredMDetail,
  findByStationFuelTorambo,
  updateMasterData,
  insertMasterData,
  getFueltypeMDetail,
  getPreviousReading,
};
