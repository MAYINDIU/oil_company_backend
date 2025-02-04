const ApiError = require("../errors/APIError.js");
const leaveApplicationModel = require("../models/leaveapplicationModel.js");
const db = require("../config/db.js");
const sendResponse = require("../utilities/sendResponse.js");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {
  passwordHash,
  passwordVerify,
} = require("../utilities/passwordEncryption.js");
const generateJWT = require("../utilities/generateJWT.js");
const config = require("../config/index.js");
const catchAsync = require("../utilities/catchAsync.js");
const {JWT_SECRET}=process.env;


function getAllleaveapplication(req, res) {
  leaveApplicationModel.getAllLeaveApplication((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all leave_types successfully",
        data: users,
      });
    }
  });
}



const createLeaveApplication = async (req, res) => {
  try {
    const body = req.body;
    // Validate input (Example: check if leave_types_name exists)
    if (!body) {
      return res.status(400).json({ success: false, message: "Leave Application data is required" });
    }

    // Save the leave_types data to the database
    leaveApplicationModel.createLeaveApplication(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "Leave Application created successfully",
          leave_typesId: result.insertId, // Corrected from userId to leave_typesId
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






const approveLeaveApplication = (req, res) => {
  const { leave_application_id } = req.params;  // Extract leave_application_id from the route params
   console.log(leave_application_id)
  if (!leave_application_id) {
    return res.status(400).json({ error: 'Leave application ID is required' });
  }

  leaveApplicationModel.updateLeaveApplication(leave_application_id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(200).json({ message: 'Leave application approved', result });
  });
};



const removeleave_application = catchAsync(async (req, res) => {
  const leave_application_id = req.params.leave_application_id;
  await leaveApplicationModel.removeLeaveApplication(leave_application_id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "Leave application deleted successfully",
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


const singleleave_info = async (req, res) => {
  const { id } = req.params;

  // Fetching the leave application using the provided ID
  leaveApplicationModel.getSingleLeaveApplication(id, (err, leave_applications) => {
    if (err) {
      throw new ApiError(500, err.message); // Handle the error appropriately
    } else {
      // Ensure the response is an array of objects
      const responseData = Array.isArray(leave_applications) ? leave_applications : [leave_applications];

      // Sending the response
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Leave data fetched successfully",
        data: responseData,
      });
    }
  });
};








module.exports = {
  getAllleaveapplication,
  createLeaveApplication,
  approveLeaveApplication,
  removeleave_application,
  singleleave_info
};
