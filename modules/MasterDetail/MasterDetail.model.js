const db = require("../../config/db.js");

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
// function createMasterData(mDetail, callback) {
//   db.query("INSERT INTO m_detail  SET ?", mDetail, (err, results) => {
//     if (err) {
//       // Fix the variable name from `err` to `error`
//       callback(err, null);
//       return;
//     } else {
//       callback(null, results);
//     }
//   });
// }

function createMasterData(mDetail, callback) {
  const { station_id, tr_date, fuel_type, torambo_no } = mDetail;

  // Step 1: Check if the record already exists
  db.query(
    "SELECT * FROM m_detail WHERE station_id = ? AND tr_date = ? AND fuel_type=? AND torambo_no=?",
    [station_id, tr_date, fuel_type, torambo_no],
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
        db.query("INSERT INTO m_detail SET ?", mDetail, (err, results) => {
          if (err) {
            callback(err, null); // Handle insertion error
          } else {
            callback(null, results); // Return the results from the insertion
          }
        });
      }
    }
  );
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



const getFueltypeMDetail = (station_id, fuel_type, c_date, callback) => {
  const query = `
      SELECT md.*, b.branch_name 
      FROM m_detail md
      LEFT JOIN branch b ON md.station_id = b.branch_id
      WHERE md.station_id = ? 
        AND md.fuel_type = ? 
        AND DATE(md.tr_date) = ?  -- Replaced CURDATE() with the filter_date placeholder
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

const updateMasterDatas = (
  updatedPreviousReading,
  present_reading,
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
      station_id,
      fuel_type,
      torambo_no,
    ],
    callback
  );
};



const getPrevReading = (station_id, fuel_type, torambo_no, callback) => {
  // const query = `SELECT present_reading as Prv_reading 
  //   FROM m_detail
  //   WHERE station_id = ? 
  //   AND fuel_type = ?
  //   AND torambo_no = ?
  //   AND tr_date = DATE_SUB(?, INTERVAL 1 DAY)
  //   LIMIT 1`;


  const query = `SELECT present_reading AS Prv_reading
FROM m_detail
WHERE station_id = ?
  AND fuel_type = ?
  AND torambo_no = ?
ORDER BY tr_date DESC
LIMIT 1`;
 

  db.query(query, [station_id, fuel_type, torambo_no], (err, results) => {
    if (err) {
      console.error("Error fetching m_detail data:", err);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, { message: "No previous reading found." });
    }

    callback(null, results[0]);
  });
};



const getSinglemDetails = (id, callback) => {
  const query = `SELECT * 
FROM m_detail md
JOIN branch b ON b.branch_id = md.station_id
WHERE md.id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching single m_detail data:", err);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, { message: "No previous single reading found." });
    }

    callback(null, results[0]);
  });
};

// Update Master single Data
const updateMasterSingleData = (id, updateData, callback) => {
  const { station_id, fuel_type, torambo_no, previous_reading, present_reading, sale_unit, addition } = updateData;
  const query = `
    UPDATE m_detail
    SET 
      station_id = ?, 
      fuel_type = ?, 
      torambo_no = ?, 
      previous_reading = ?, 
      present_reading = ?, 
      sale_unit = ?, 
      addition = ?
    WHERE id = ?;
  `;

  db.query(query, [station_id, fuel_type, torambo_no, previous_reading, present_reading, sale_unit, addition, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};




const MdetailbackupAndDelete = (id, callback) => {
  // Begin transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return callback(err, null);
    }

    // Insert data into backup table
    const insertQuery = `INSERT INTO m_detail_backup SELECT * FROM m_detail WHERE id = ?`;
    db.query(insertQuery, [id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error during insert:", err);
          callback(err, null);
        });
      }

      // Delete the original data from m_detail
      const deleteQuery = `DELETE FROM m_detail WHERE id = ?`;
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error during delete:", err);
            callback(err, null);
          });
        }

        // Commit the transaction if everything is successful
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error during commit:", err);
              callback(err, null);
            });
          }

          // Everything went fine, return success
          callback(null, result);
        });
      });
    });
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
  updateMasterDatas,
  getPrevReading,
  getSinglemDetails,
  updateMasterSingleData,
  MdetailbackupAndDelete
};
