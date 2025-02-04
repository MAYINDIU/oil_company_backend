const ApiError = require("../errors/APIError.js");
const advanceSalaryModel = require("../models/advanceSalaryModel.js");
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

function getAlladvsalaryapplication(req, res) {
  advanceSalaryModel.getAllsalary_advance_applications((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all adv. Salary Application successfully",
        data: users,
      });
    }
  });
}


const createadvsalaryapplication = async (req, res) => {
  try {
    const body = req.body;

    // Save the position data to the database
    advanceSalaryModel.createsalary_advance_applications(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "Application created successfully",
          positionId: result.insertId, // Corrected from userId to positionId
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const singleSalaryadv_info = async (req, res) => {
  const { id } = req.params;

  // Fetching the leave application using the provided ID
  advanceSalaryModel.getSingleSadvApplication(id, (err, salaryAdv) => {
    if (err) {
      throw new ApiError(500, err.message); // Handle the error appropriately
    } else {
      // Ensure the response is an array of objects
      const responseData = Array.isArray(salaryAdv) ? salaryAdv : [salaryAdv];

      // Sending the response
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Advance Salary data fetched successfully",
        data: responseData,
      });
    }
  });
};



const approvesalaryApplication = (req, res) => {
  const { id } = req.params;  // Extract leave_application_id from the route params

  if (!id) {
    return res.status(400).json({ error: 'Salary application ID is required' });
  }

  advanceSalaryModel.updateSalryApplication(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(200).json({ message: 'Salary application approved', result });
  });
};







module.exports = {
  getAlladvsalaryapplication,
  createadvsalaryapplication,
  singleSalaryadv_info,
  approvesalaryApplication
};



