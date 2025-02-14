const db = require("../../config/db.js");

//  master summary report

const getSummaryDetails = (station_id, tr_date, callback) => {
  const query = `SELECT 
    ms.*, 
    md.fuel_type,
    md.torambo_no,
    md.previous_reading,
    md.present_reading,
    md.sale_unit,
    md.addition,
    md.tr_date,
    b.branch_name  
FROM master_summary ms
LEFT JOIN m_detail md 
    ON ms.station_id = md.station_id 
    AND ms.tr_date = md.tr_date
LEFT JOIN branch b
    ON md.station_id = b.branch_id  
WHERE ms.station_id = ? 
AND ms.tr_date = ?
ORDER BY md.torambo_no ASC
  `;

  db.query(query, [station_id, tr_date], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  getSummaryDetails,
};
