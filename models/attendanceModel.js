// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all emp_attendance
function getAllemp_attendance(callback) {
  db.query("SELECT * FROM emp_attendance", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}



// Function to get attendance by employee and date
function getAttendanceByDate(employee_id, at_date, callback) {
  const query = "SELECT * FROM emp_attendance WHERE employee_id = ? AND at_date = ?";
  db.query(query, [employee_id, at_date], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

// Function to create a new attendance record
function createemp_attendance(data, callback) {
  db.query("INSERT INTO emp_attendance SET ?", data, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

// Function to update an existing attendance record
function updateAttendance(attendance_id, data, callback) {
  db.query("UPDATE emp_attendance SET ? WHERE id = ?", [data, attendance_id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


// // Create a new emp_attendance
// function createemp_attendance(user, callback) {
//   // Fix the variable name from `error` to `err`
//   db.query("INSERT INTO emp_attendance SET ?", user, (err, results) => {
//     if (err) {
//       // Fix the variable name from `err` to `error`
//       callback(err, null);
//       return;
//     } else {
//       callback(null, results);
//     }
//   });
// }



//update emp_attendance
function updateemp_attendance(id, data, callback) {
  const updateQuery =
    "UPDATE emp_attendance SET " +
    Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ") +
    " WHERE id = ?";
  const updateValues = [...Object.values(data), id];
  // console.log("User Service", updateQuery, updateValues);
  db.query(updateQuery, updateValues, (err, rows) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

//delete emp_attendance
const removeemp_attendance = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM emp_attendance WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


//get a single EMPLOYEE
function getSingleemp_attendance(id, callback) {
  db.query("SELECT * FROM emp_attendance WHERE employee_id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

//get a single EMPLOYEE Leave duration
const getLeaveDurations = (employee_id, callback) => {
  const query = `
    SELECT leave_type_id, employee_id, 
           SUM(duration) AS total_days
    FROM leave_applications
    WHERE status = 'approved' 
      AND employee_id = ?
    GROUP BY leave_type_id `;

  db.query(query, [employee_id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};



module.exports = {
  getAllemp_attendance,
  createemp_attendance,
  updateemp_attendance,
  removeemp_attendance,
  getSingleemp_attendance,
  getAttendanceByDate,
  updateAttendance,
  getLeaveDurations
};
