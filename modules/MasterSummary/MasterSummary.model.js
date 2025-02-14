const db = require("../../config/db.js");

//  master summary entry

function createMasterSummaryDatacheck(mDetail, callback) {
  const { station_id, tr_date } = mDetail;

  // Step 1: Check if the record already exists
  db.query(
    "SELECT * FROM master_summary WHERE station_id = ? AND tr_date = ?",
    [station_id, tr_date],
    (err, results) => {
      if (err) {
        callback(err, null); // Handle database error
        return;
      }

      if (results.length > 0) {
        // Record exists, handle the case (return an error or update, depending on your requirement)
        callback(
          "Record already exists for the given station_id and tr_date",
          null
        );
      } else {
        // Step 2: Insert the new record if it doesn't exist
        db.query(
          "INSERT INTO master_summary SET ?",
          mDetail,
          (err, results) => {
            if (err) {
              callback(err, null); // Handle insertion error
            } else {
              callback(null, results); // Return the results from the insertion
            }
          }
        );
      }
    }
  );
}

const getLatestPreviousStock = (station_id, callback) => {
  const query = `
    SELECT previous_patrol_95, previous_patrol_91, previous_diesel,available_cash
    FROM master_summary
    WHERE station_id = ?
    ORDER BY STR_TO_DATE(tr_date, '%Y-%m-%d') DESC
    LIMIT 1;
  `;

  db.query(query, [station_id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0] || {}); // Return empty object if no data found
  });
};

module.exports = {
  createMasterSummaryDatacheck,
  getLatestPreviousStock,
};
