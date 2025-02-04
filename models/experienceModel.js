// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");

//get all experience
function getAllexperience(callback) {
  db.query("SELECT * FROM experience", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


function createexperience(experiences, callback) {
  // Build a query string with multiple values
  const query = "INSERT INTO experience (employee_id,company_name, job_title, start_date, end_date, responsibilities) VALUES ?";
  
  // Map the experience records to the format required by SQL
  const values = experiences?.map(exp => [
    exp.employee_id,
    exp.company_name,
    exp.job_title,
    exp.start_date,
    exp.end_date,
    exp.responsibilities
  ]);

  // Execute the query
  db.query(query, [values], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
}


//update experience
function updateexperience(id, data, callback) {
  const updateQuery =
    "UPDATE experience SET " +
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

//delete experience
const removeexperience = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM experience WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


//get a single EMPLOYEE
function getSingleexperience(id, callback) {
  db.query("SELECT * FROM experience WHERE employee_id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}


module.exports = {
  getAllexperience,
  createexperience,
  updateexperience,
  removeexperience,
  getSingleexperience
};
