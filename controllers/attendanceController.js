const ApiError = require("../errors/APIError.js");
const attendanceModel = require("../models/attendanceModel.js");
const db = require("../config/db.js");
const sendResponse = require("../utilities/sendResponse.js");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {passwordHash,passwordVerify,} = require("../utilities/passwordEncryption.js");
const generateJWT = require("../utilities/generateJWT.js");
const config = require("../config/index.js");
const catchAsync = require("../utilities/catchAsync.js");
const {JWT_SECRET}=process.env;
const moment = require('moment'); // Ensure moment.js is installed (`npm install moment`)

function getAllattendance(req, res) {
  attendanceModel.getAllattendance((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all attendance list successfully",
        data: users,
      });
    }
  });
}


// const createattendance = async (req, res) => {
//   try {
//     const body = req.body;

//     // Validate input (Example: check if Employee exists)
//     if (!body) {
//       return res.status(400).json({ success: false, message: "Attendance data is required" });
//     }

//     // Add system date (at_date) and current time (ent) to the body
//     body.at_date = moment().format('YYYY-MM-DD'); // Set the system date as YYYY-MM-DD
//     body.ent = moment().format('HH:mm:ss');       // Set the current time as HH:mm:ss

//     // Save the attendance data to the database
//     attendanceModel.createemp_attendance(body, (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       } else {
//         return res.status(201).json({
//           success: true,
//           message: "Attendance created successfully",
//           result // This will return the result of the insert operation
//         });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const createattendance = async (req, res) => {
  try {
    const body = req.body;

    // Validate input
    if (!body || !body.employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    const currentDate = moment().format('YYYY-MM-DD'); // Current system date (at_date)
    const currentTime = moment().format('HH:mm:ss');   // Current time (ent or ext)

    // First, check if attendance already exists for this employee on the current date
    attendanceModel.getAttendanceByDate(body.employee_id, currentDate, async (err, existingAttendance) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingAttendance.length > 0) {
        // Attendance exists, update the 'ext' field (exit time)
        const updateData = { ext: currentTime }; // Update exit time
        attendanceModel.updateAttendance(existingAttendance[0].id, updateData, (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.status(200).json({
            success: true,
            message: "Attendance updated successfully (exit time recorded)",
            result
          });
        });
      } else {
        // Attendance does not exist, create a new record
        body.at_date = currentDate;  // Set the system date
        body.ent = currentTime;      // Set the entry time

        attendanceModel.createemp_attendance(body, (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.status(201).json({
            success: true,
            message: "Attendance created successfully (entry time recorded)",
            result
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateattendance= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  attendanceModel.updateattendance(id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Employee updated successfully",
        data: user,
      });
    }
  });
};


const removeattendance = catchAsync(async (req, res) => {
  const id = req.params.id;
  await attendanceModel.removeattendance(id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "attendance Data deleted successfully",
              data: result,
          });
      })
      .catch((error) => {
          sendResponse(res, {
              statusCode: 500,
              success: false,
              message: "Something went wrong",
              error: error.message,
          });
      });
});


const singleattendancedata = async (req, res) => {
  const { id } = req.params;

  attendanceModel.getSingleemp_attendance(id, (err, position) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      // Ensure the data is always returned as an array of objects
      const dataArray = Array.isArray(position) ? position : [position];

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Attendance fetched successfully",
        data: dataArray, // Returning as an array of objects
      });
    }
  });
};

// Controller to handle the leave duration retrieval
const getLeaveDurationsByEmployee = (req, res) => {
  const { employee_id } = req.params; // Get employee_id from URL params

  attendanceModel.getLeaveDurations(employee_id, (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database query error', error: err.message });
    }

    // Return the results in the response
    return res.status(200).json({
      success: true,
      data
    });
  });
};




module.exports = {
  getAllattendance,
  createattendance,
  updateattendance,
  removeattendance,
  singleattendancedata,
  getLeaveDurationsByEmployee
};



