const ApiError = require("../errors/APIError.js");
const departmentModel = require("../models/departmentModel.js");
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


function getAlldepartment(req, res) {
  departmentModel.getAlldepartment((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all department successfully",
        data: users,
      });
    }
  });
}



const createdepartment = async (req, res) => {
  try {
    const body = req.body;

    // Validate input (Example: check if department_name exists)
    if (!body.department_name) {
      return res.status(400).json({ success: false, message: "department name is required" });
    }

    // Save the department data to the database
    departmentModel.createdepartment(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "department created successfully",
          departmentId: result.insertId, // Corrected from userId to departmentId
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updatedepartment= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  departmentModel.updatedepartment(id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "department updated successfully",
        data: user,
      });
    }
  });
};


const removedepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  await departmentModel.removedepartment(id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "department deleted successfully",
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


const singledepartment = async (req, res) => {
  const { id } = req.params;
  departmentModel.getSingledepartment(id, (err, department) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "department fetched successfully",
        data: department,
      });
    }
  });
};



module.exports = {
  getAlldepartment,
  createdepartment,
  updatedepartment,
  removedepartment,
  singledepartment
};
