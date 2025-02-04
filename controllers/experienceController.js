const ApiError = require("../errors/APIError.js");
const experienceModel = require("../models/experienceModel.js");
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

function getAllexperience(req, res) {
  experienceModel.getAllexperience((err, users) => {
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




const createexperience = async (req, res) => {
  try {
    const body = req.body;
    console.log(body)
    // Validate input
    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ success: false, message: "experience data is required" });
    }

    // Save the experience data to the database
    experienceModel.createexperience(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "experience data created successfully",
          result // This will return the result of the insert operation
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updateexperience= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  experienceModel.updateexperience(id, data, (err, user) => {
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


const removeexperience = catchAsync(async (req, res) => {
  const id = req.params.id;
  await experienceModel.removeexperience(id)
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


const singleexperiencedata = async (req, res) => {
  const { id } = req.params;
  experienceModel.getSingleexperience(id, (err, position) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "experience fetched successfully",
        data: position,
      });
    }
  });
};


module.exports = {
  getAllexperience,
  createexperience,
  updateexperience,
  removeexperience,
  singleexperiencedata
};



