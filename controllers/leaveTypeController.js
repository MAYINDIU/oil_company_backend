const ApiError = require("../errors/APIError.js");
const leave_typesModel = require("../models/leaveTypeModel.js");
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


function getAllleave_types(req, res) {
  leave_typesModel.getAllleave_types((err, users) => {
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



const createleave_types = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    // Validate input (Example: check if leave_types_name exists)
    if (!body) {
      return res.status(400).json({ success: false, message: "leave_types name is required" });
    }

    // Save the leave_types data to the database
    leave_typesModel.createleave_types(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "leave_types created successfully",
          leave_typesId: result.insertId, // Corrected from userId to leave_typesId
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updateleave_types= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  leave_typesModel.updateleave_types(id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "leave_types updated successfully",
        data: user,
      });
    }
  });
};


const removeleave_types = catchAsync(async (req, res) => {
  const id = req.params.id;
  await leave_typesModel.removeleave_types(id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "leave_types deleted successfully",
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


const singleleave_types = async (req, res) => {
  const { id } = req.params;
  leave_typesModel.getSingleleave_types(id, (err, leave_types) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "leave_types fetched successfully",
        data: leave_types,
      });
    }
  });
};



module.exports = {
  getAllleave_types,
  createleave_types,
  updateleave_types,
  removeleave_types,
  singleleave_types
};
