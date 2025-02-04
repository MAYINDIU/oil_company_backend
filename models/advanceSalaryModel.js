// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all salary_advance_applications
function getAllsalary_advance_applications(callback) {
  db.query("SELECT * FROM salary_advance_applications", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}




function createsalary_advance_applications(user, callback) {
  // Fix the variable name from `error` to `err`
  db.query("INSERT INTO salary_advance_applications SET ?", user, (err, results) => {
    if (err) {
      // Fix the variable name from `err` to `error`
      callback(err, null);
      return;
    } else {
      callback(null, results);
    }
  });
}



//get a single Application data
function getSingleSadvApplication(id, callback) {
  db.query("SELECT * FROM salary_advance_applications WHERE employee_id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

//update Salary advance
const updateSalryApplication = (id, callback) => {
  const updateQuery = `
    UPDATE salary_advance_applications 
    SET status = 'Approved', 
        approved_date = SYSDATE()
    WHERE id = ?`;

  db.query(updateQuery, [id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};





module.exports = {
  getAllsalary_advance_applications,
  createsalary_advance_applications,
  getSingleSadvApplication,
  updateSalryApplication

};
