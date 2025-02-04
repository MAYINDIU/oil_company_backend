const ApiError = require("../errors/APIError.js");
const employeeModel = require("../models/employeeModel.js");
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

function getAllemployees(req, res) {
  employeeModel.getAllemployees((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all employee successfully",
        data: users,
      });
    }
  });
}



const createEmployee = async (req, res) => {
  try {
    const body = req.body;

    // Validate input (Example: check if Employee exists)
    if (!body) {
      return res.status(400).json({ success: false, message: "Employee data is required" });
    }

    // Save the position data to the database
    employeeModel.createEmployees(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "Employee created successfully",
          positionId: result.insertId, // Corrected from userId to positionId
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updateEmployee= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  employeeModel.updateemployees(id, data, (err, user) => {
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


const removeEmployee = catchAsync(async (req, res) => {
  const id = req.params.id;
  await employeeModel.removeemployees(id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "Employee deleted successfully",
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


const singleEmployee = async (req, res) => {
  const { id } = req.params;
  employeeModel.getSingleEmployee(id, (err, position) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      // Ensure the result is always an array of objects
      const dataArray = position ? [position] : [];

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Employee fetched successfully",
        data: dataArray, // Always return as an array of objects
      });
    }
  });
};




module.exports = {
  getAllemployees,
  createEmployee,
  updateEmployee,
  removeEmployee,
  singleEmployee
};
