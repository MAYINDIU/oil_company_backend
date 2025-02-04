// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all LeaveApplication
function getAllLeaveApplication(callback) {
  const query = `SELECT 
  employees.first_name,    -- Select first name from employees
  employees.last_name,     -- Select last name from employees
  employees.department_id, -- Select department_id from employees
  department.department_name AS department_name, -- Select department name
  position.position_name AS position_name,     -- Select position name
  leave_applications.*    -- Select all columns from leave_applications
FROM 
  leave_applications
LEFT JOIN 
  employees ON employees.employee_id = leave_applications.employee_id
LEFT JOIN 
  department ON department.id = employees.department_id
LEFT JOIN 
  position ON position.id = employees.position_id;
`;

  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}



//Create a new Leave Application
function createLeaveApplication(user, callback) {

  db.query("INSERT INTO leave_applications SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}

//get a single LeaveApplication
function getSingleLeaveApplication(id, callback) {
  db.query("SELECT * FROM leave_applications WHERE employee_id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}






//update LeaveApplication
// function updateLeaveApplication(leave_application_id, callback) {
//   const updateQuery = `
//     UPDATE leave_applications 
//     SET status = 'approved', 
//         approved_date = SYSDATE()
//     WHERE leave_application_id = ?`;

//   db.query(updateQuery, [leave_application_id], (err, result) => {
//     if (err) {
//       return callback(err, null);  // Pass error to callback
//     }
//     callback(null, result);  // Pass result to callback
//   });
// }



const updateLeaveApplication = (leave_application_id, callback) => {
  const updateQuery = `
    UPDATE leave_applications 
    SET status = 'approved', 
        approved_date = SYSDATE()
    WHERE leave_application_id = ?`;

  db.query(updateQuery, [leave_application_id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};






//delete LeaveApplication
const removeLeaveApplication = (leave_application_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM leave_applications WHERE leave_application_id = ?",
      [leave_application_id],  // Make sure to use an array for the parameter
      (err, result) => {
        if (err) reject(err);  // Reject the promise if there's an error
        else resolve(result);  // Resolve the promise with the result
      }
    );
  });
};



module.exports = {
  getAllLeaveApplication,
  createLeaveApplication,
  updateLeaveApplication,
  removeLeaveApplication,
  getSingleLeaveApplication
};
