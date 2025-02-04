// userModel.js
const db = require("../config/db");
const dotenv = require("dotenv");



//get all university
function getAlluniversity(callback) {
  db.query("SELECT * FROM universities", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

//get all education
function getAlleducation(callback) {
  db.query("SELECT * FROM education", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}


function createeducation(educations, callback) {
  // Build a query string with multiple values
  const query = "INSERT INTO education (employee_id,institution, degree,grade, cgpa, passing_year, board) VALUES ?";
  
  // Map the education records to the format required by SQL
  const values = educations?.map(edu => [
    edu.employee_id,
    edu.institution,
    edu.degree,
    edu.grade,
    edu.cgpa,
    edu.passing_year,
    edu.board
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


//update education
function updateeducation(id, data, callback) {
  const updateQuery =
    "UPDATE education SET " +
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

//delete education
const removeeducation = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM education WHERE id = ? ",
      id,
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


//get a single EMPLOYEE
function getSingleEducation(id, callback) {
  db.query("SELECT * FROM education WHERE employee_id = ? ", id, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
}


module.exports = {
  getAlluniversity,
  getAlleducation,
  createeducation,
  updateeducation,
  removeeducation,
  getSingleEducation
};
