const ApiError = require("../errors/APIError.js");
const positionModel = require("../models/positionModel.js");
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


function getAllposition(req, res) {
  positionModel.getAllposition((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all position successfully",
        data: users,
      });
    }
  });
}



const createPosition = async (req, res) => {
  try {
    const body = req.body;

    // Validate input (Example: check if position_name exists)
    if (!body.position_name) {
      return res.status(400).json({ success: false, message: "Position name is required" });
    }

    // Save the position data to the database
    positionModel.createPosition(body, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(201).json({
          success: true,
          message: "Position created successfully",
          positionId: result.insertId, // Corrected from userId to positionId
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const updatePosition= async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  positionModel.updatePosition(id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Position updated successfully",
        data: user,
      });
    }
  });
};


const removePosition = catchAsync(async (req, res) => {
  const id = req.params.id;
  await positionModel.removePosition(id)
      .then((result) => {
          sendResponse(res, {
              statusCode: 200,
              success: true,
              message: "Position deleted successfully",
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


const singlePosition = async (req, res) => {
  const { id } = req.params;
  positionModel.getSinglePosition(id, (err, position) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Position fetched successfully",
        data: position,
      });
    }
  });
};



module.exports = {
  getAllposition,
  createPosition,
  updatePosition,
  removePosition,
  singlePosition
};
