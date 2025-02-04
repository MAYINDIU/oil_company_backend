const ApiError = require("../errors/APIError.js");
const educationModel = require("../models/educationModel.js");
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

function getAlleducation(req, res) {
  educationModel.getAlleducation((err, users) => {
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
function getAlluniversity(req, res) {
  educationModel.getAlluniversity((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all university successfully",
        data: users,
      });
    }
  });
}



const createEducation = async (req, res) => {
  try {
    const body = req.body;

    // console.log(body)

    // Validate input
    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ success: false, message: "Education data is required" });
    }

    // Save the education data to the database
    educationModel.createeducation(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "Education data created successfully",
          result // This will return the result of the insert operation
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updateeducation= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  educationModel.updateeducation(id, data, (err, user) => {
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


const removeeducation = catchAsync(async (req, res) => {
  const id = req.params.id;
  await educationModel.removeeducation(id)
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


const singleEducationdata = async (req, res) => {
  const { id } = req.params;
  educationModel.getSingleEducation(id, (err, position) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Education fetched successfully",
        data: position,
      });
    }
  });
};


module.exports = {
  getAlleducation,
  getAlluniversity,
  createEducation,
  updateeducation,
  removeeducation,
  singleEducationdata
};



