const ApiError = require("../errors/APIError");
const supplierModel = require("../models/supplierModel.js");
const db = require("../config/db");
const sendResponse = require("../utilities/sendResponse");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {
  passwordHash,
  passwordVerify,
} = require("../utilities/passwordEncryption");
const generateJWT = require("../utilities/generateJWT");
const config = require("../config/index.js");
const catchAsync = require("../utilities/catchAsync");
const {JWT_SECRET}=process.env;
    
    
const createSupplier = async (req, res) => {
    try {
      // Assuming you get the supplier data from the request body
      const { supplierName, contactPerson, phoneNumber, email, address } = req.body;
  
      // You should validate the input data here, for example:
      if (!supplierName || !contactPerson || !phoneNumber || !email || !address) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Prepare the data for saving to the database
      const saveData = {
        supplier_name: supplierName,
        contact_person: contactPerson,
        phone_number: phoneNumber,
        email: email,
        address: address,
      };
  
      // Save the supplier data to the database using your model's createSupplier method
      supplierModel.createSupplier(saveData, (err, result) => {
        if (err) {
          // Log the error for debugging
          console.error('Error inserting supplier data:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // Respond with success message and the inserted supplier's ID
        res.status(201).json({
          success: true,
          message: 'Supplier created successfully',
          userId: result.insertId, // Assuming `insertId` is the ID of the newly created supplier
        });
      });
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      res.status(500).json({ error: error.message });
    }
  };


  function getAllSupplier(req, res) {
    supplierModel.getAllSuppliers((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Fetched all suppliers successfully",
          data: users,
        });
      }
    });
  }


  const updateSupplier= async (req, res) => {
    const { supplier_id } = req.params;
    console.log(supplier_id);
    const { ...data } = req.body;
    // console.log(id, data);
    supplierModel.updateSupplier(supplier_id, data, (err, user) => {
      if (err) {
        // console.log(err);
        throw new ApiError(500, err.message);
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "supplier updated successfully",
          data: user,
        });
      }
    });
  };

  
  

  module.exports = {
       createSupplier,
       getAllSupplier,
       updateSupplier
  };
  