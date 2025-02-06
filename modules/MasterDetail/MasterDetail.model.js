const db = require("../../config/db.js");

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
      ORDER BY md.date DESC
  `;

  db.query(query, [station_id, fuel_type, torambo_no], (err, results) => {
    if (err) {
      console.error("Error fetching m_detail data:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getFueltypeMDetail = (station_id, fuel_type, callback) => {
  const query = `
      SELECT md.*, b.branch_name 
      FROM m_detail md
      LEFT JOIN branch b ON md.station_id = b.branch_id
      WHERE md.station_id = ? 
        AND md.fuel_type = ? 
        AND DATE(md.date) = CURDATE()
      ORDER BY md.date DESC 
  `;

  db.query(query, [station_id, fuel_type], (err, results) => {
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
  getFueltypeMDetail,
};
