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

const getLatestPreviousStock = (station_id, tr_date, callback) => {
  const query = `SELECT total_stock_91, total_stock_95, total_stock_diesel, available_cash
FROM master_summary
WHERE station_id = ?
AND tr_date = DATE_SUB(?, INTERVAL 1 DAY)
LIMIT 1

  `;

  db.query(query, [station_id, tr_date], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0] || {}); // Return empty object if no data found
  });
};

//Station wise stock report
const getFuelSummary = async (stationId, fromDate, toDate) => {
  const query = `WITH date_series AS (
    SELECT DATE_ADD(?, INTERVAL (a.a + (10 * b.a)) DAY) AS tr_date
    FROM 
      (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
       UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
    CROSS JOIN 
      (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
       UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
    WHERE DATE_ADD(?, INTERVAL (a.a + (10 * b.a)) DAY) <= ?
  )

  SELECT 
  ds.tr_date,

  COALESCE(MAX(master_summary.total_stock_91), 0) AS closeing_blc_91,
  COALESCE(MAX(master_summary.total_stock_95), 0) AS closeing_blc95,
  COALESCE(MAX(master_summary.total_stock_diesel), 0) AS closeing_blc_diesel,

  COALESCE(MAX(prev_day.total_stock_91), 0) AS total_stock_91,
  COALESCE(MAX(prev_day.total_stock_95), 0) AS total_stock_95,
  COALESCE(MAX(prev_day.total_stock_diesel), 0) AS total_stock_diesel,

  COALESCE(MAX(master_summary.t_sale_91), 0) AS t_sale_91,
  COALESCE(MAX(master_summary.sheet_extra_91), 0) AS sheet_extra_91,
  COALESCE(MAX(master_summary.cal_extra_91), 0) AS cal_extra_91,
  COALESCE(MAX(master_summary.t_sale_95), 0) AS t_sale_95,
  COALESCE(MAX(master_summary.sheet_extra_95), 0) AS sheet_extra_95,
  COALESCE(MAX(master_summary.cal_extra_95), 0) AS cal_extra_95,
  COALESCE(MAX(master_summary.t_sale_diesel), 0) AS t_sale_diesel,
  COALESCE(MAX(master_summary.sheet_extra_diesel), 0) AS sheet_extra_diesel,
  COALESCE(MAX(master_summary.cal_extra_diesel), 0) AS cal_extra_diesel,
  
   COALESCE(MAX(master_summary.previous_patrol_95+master_summary.add_patrol_95+master_summary.extra_purchase_95-  t_sale_95+cal_extra_95), 0) AS closing_blnc_actual_95,
   
   COALESCE(MAX(master_summary.previous_patrol_91+master_summary.add_patrol_91+master_summary.extra_purchase_91-  t_sale_91+cal_extra_91), 0) AS closing_blnc_actual_91,
   
      COALESCE(MAX(master_summary.previous_diesel+master_summary.add_diesel+master_summary.extra_purchase_diesel-  t_sale_diesel+cal_extra_diesel), 0) AS closing_blnc_actual_disel,
  
  

  COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = '91' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_91,
  COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = '95' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_95,
  COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = 'Diesel' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_diesel

FROM 
  date_series ds
LEFT JOIN master_summary 
  ON ds.tr_date = master_summary.tr_date 
  AND master_summary.station_id = ?

LEFT JOIN purchase_rate 
  ON purchase_rate.tr_date = ds.tr_date 
  AND purchase_rate.station_id = ?

LEFT JOIN (
  SELECT 
    station_id,
    total_stock_91,
    total_stock_95,
    total_stock_diesel,
    tr_date
  FROM master_summary
) AS prev_day
ON prev_day.station_id = ?
AND prev_day.tr_date = DATE_SUB(ds.tr_date, INTERVAL 1 DAY)

GROUP BY ds.tr_date
ORDER BY ds.tr_date`;

  const values = [fromDate, fromDate, toDate, stationId, stationId, stationId];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

//date wise all station stock report
const getDatewiseFuelSummary = async (fromDate, toDate) => {
  const query = `
    WITH date_series AS (
      SELECT DATE_ADD(?, INTERVAL (a.a + (10 * b.a)) DAY) AS tr_date
      FROM 
        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
         UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
      CROSS JOIN 
        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
         UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
      WHERE DATE_ADD(?, INTERVAL (a.a + (10 * b.a)) DAY) <= ?
    )

    SELECT 
        ds.tr_date,
        COALESCE(master_summary.station_id, 0) AS station_id,
        COALESCE(branch.branch_name, 'Unknown') AS branch_name, 
        
        COALESCE(master_summary.total_stock_91, 0) AS closeing_blc_91,
        COALESCE(master_summary.total_stock_95, 0) AS closeing_blc_95,
        COALESCE(master_summary.total_stock_diesel, 0) AS closeing_blc_diesel,

        COALESCE(prev_day.total_stock_91, 0) AS total_stock_91,
        COALESCE(prev_day.total_stock_95, 0) AS total_stock_95,
        COALESCE(prev_day.total_stock_diesel, 0) AS total_stock_diesel,

        COALESCE(master_summary.t_sale_91, 0) AS t_sale_91,
        COALESCE(master_summary.sheet_extra_91, 0) AS sheet_extra_91,
        COALESCE(master_summary.cal_extra_91, 0) AS cal_extra_91,
        COALESCE(master_summary.t_sale_95, 0) AS t_sale_95,
        COALESCE(master_summary.sheet_extra_95, 0) AS sheet_extra_95,
        COALESCE(master_summary.cal_extra_95, 0) AS cal_extra_95,
        COALESCE(master_summary.t_sale_diesel, 0) AS t_sale_diesel,
        COALESCE(master_summary.sheet_extra_diesel, 0) AS sheet_extra_diesel,
        COALESCE(master_summary.cal_extra_diesel, 0) AS cal_extra_diesel,

        COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = '91' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_91,
        COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = '95' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_95,
        COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = 'Diesel' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_diesel

    FROM 
        date_series ds
    LEFT JOIN master_summary 
        ON ds.tr_date = master_summary.tr_date

    LEFT JOIN branch 
        ON branch.branch_id = master_summary.station_id 

    LEFT JOIN purchase_rate 
        ON purchase_rate.tr_date = ds.tr_date
        AND purchase_rate.station_id = master_summary.station_id 

    LEFT JOIN (
        SELECT 
            station_id,
            total_stock_91,
            total_stock_95,
            total_stock_diesel,
            tr_date
        FROM master_summary
    ) AS prev_day
        ON prev_day.tr_date = DATE_SUB(ds.tr_date, INTERVAL 1 DAY)
        AND prev_day.station_id = master_summary.station_id 

    GROUP BY 
        ds.tr_date, 
        master_summary.station_id, 
        branch.branch_name, 
        prev_day.total_stock_91, 
        prev_day.total_stock_95, 
        prev_day.total_stock_diesel

    ORDER BY ds.tr_date`;

  const values = [fromDate, fromDate, toDate];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateMasterSummary = (station_id, tr_date, data, callback) => {
  const updateQuery =
    "UPDATE master_summary SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`) // ✅ Corrected string interpolation
      .join(", ") +
    " WHERE station_id = ? AND tr_date = ?";

  const updateValues = [...Object.values(data), station_id, tr_date];

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

module.exports = {
  createMasterSummaryDatacheck,
  getLatestPreviousStock,
  getFuelSummary,
  getDatewiseFuelSummary,
  updateMasterSummary,
};

// SELECT
// ds.tr_date,

// COALESCE(master_summary.total_stock_91, 0) AS closeing_blc_91,
// COALESCE(master_summary.total_stock_95, 0) AS closeing_blc95,
// COALESCE(master_summary.total_stock_diesel, 0) AS closeing_blc_diesel,

// COALESCE(prev_day.total_stock_91, 0) AS total_stock_91,
// COALESCE(prev_day.total_stock_95, 0) AS total_stock_95,
// COALESCE(prev_day.total_stock_diesel, 0) AS total_stock_diesel,

// COALESCE(master_summary.t_sale_91, 0) AS t_sale_91,
// COALESCE(master_summary.sheet_extra_91, 0) AS sheet_extra_91,
// COALESCE(master_summary.cal_extra_91, 0) AS cal_extra_91,
// COALESCE(master_summary.t_sale_95, 0) AS t_sale_95,
// COALESCE(master_summary.sheet_extra_95, 0) AS sheet_extra_95,
// COALESCE(master_summary.cal_extra_95, 0) AS cal_extra_95,
// COALESCE(master_summary.t_sale_diesel, 0) AS t_sale_diesel,
// COALESCE(master_summary.sheet_extra_diesel, 0) AS sheet_extra_diesel,
// COALESCE(master_summary.cal_extra_diesel, 0) AS cal_extra_diesel,

// COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = '91' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_91,
// COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = '95' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_95,
// COALESCE(SUM(CASE WHEN purchase_rate.fuel_type = 'Diesel' THEN purchase_rate.total_qty ELSE 0 END), 0) AS total_qty_diesel

// FROM
// date_series ds
// LEFT JOIN master_summary
// ON ds.tr_date = master_summary.tr_date
// AND master_summary.station_id = ?

// LEFT JOIN purchase_rate
// ON purchase_rate.tr_date = ds.tr_date
// AND purchase_rate.station_id = ?

// LEFT JOIN (
// SELECT
//   station_id,
//   total_stock_91,
//   total_stock_95,
//   total_stock_diesel,
//   tr_date
// FROM master_summary
// ) AS prev_day
// ON prev_day.station_id = ?
// AND prev_day.tr_date = DATE_SUB(ds.tr_date, INTERVAL 1 DAY)

// GROUP BY ds.tr_date, prev_day.total_stock_91, prev_day.total_stock_95, prev_day.total_stock_diesel
// ORDER BY ds.tr_date`;
