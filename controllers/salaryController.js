const ApiError = require("../errors/APIError.js");
const salaryModel = require("../models/salaryModel.js");
const db = require("../config/db.js");
const sendResponse = require("../utilities/sendResponse.js");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {passwordHash,passwordVerify,} = require("../utilities/passwordEncryption.js");
const generateJWT = require("../utilities/generateJWT.js");
const config = require("../config/index.js");
const catchAsync = require("../utilities/catchAsync.js");
const {JWT_SECRET}=process.env;

function getAllsalary(req, res) {
  salaryModel.getAllsalary((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all salary list successfully",
        data: users,
      });
    }
  });
}



const createsalary = async (req, res) => {
  try {
    const body = req.body;

    // Validate input (Example: check if Employee exists)
    if (!body) {
      return res.status(400).json({ success: false, message: "salary data is required" });
    }

    // Save the position data to the database
    salaryModel.createsalary(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
  
        return res.status(201).json({
          success: true,
          message: "salary created successfully",
          result // This will return the result of the insert operation
        });


      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updatesalary= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  salaryModel.updatesalary(id, data, (err, user) => {
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


const removesalary = catchAsync(async (req, res) => {
  const id = req.params.id;
  await salaryModel.removesalary(id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "Salary Data deleted successfully",
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


const singlesalarydata = async (req, res) => {
  const { id } = req.params;
  salaryModel.getSinglesalary(id, (err, position) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "salary fetched successfully",
        data: position,
      });
    }
  });
};


module.exports = {
  getAllsalary,
  createsalary,
  updatesalary,
  removesalary,
  singlesalarydata
};



