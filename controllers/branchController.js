const ApiError = require("../errors/APIError");
const branchModel = require("../models/branchModel.js");
const db = require("../config/db");
const sendResponse = require("../utilities/sendResponse");
    
    
const createBranch = async (req, res) => {
    try {
      // Assuming you get the supplier data from the request body
      const { branch_name , branch_address  } = req.body;
  
      // You should validate the input data here, for example:
      if (!branch_name  || !branch_address) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Prepare the data for saving to the database
      const saveData = {
        branch_name: branch_name,
        branch_address: branch_address,
  
      };
  
      // Save the supplier data to the database using your model's createSupplier method
      branchModel.createBranch(saveData, (err, result) => {
        if (err) {
          // Log the error for debugging
          console.error('Error inserting branch data:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // Respond with success message and the inserted branch's ID
        res.status(201).json({
          success: true,
          message: 'Branch created successfully',
          userId: result.insertId, // Assuming `insertId` is the ID of the newly created supplier
        });
      });
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      res.status(500).json({ error: error.message });
    }
  };


  function getAllBranch(req, res) {
    branchModel.getAllBranch((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Fetched all branch successfully",
          data: users,
        });
      }
    });
  }


  const updateBranch= async (req, res) => {
    const { branch_id } = req.params;

    const { ...data } = req.body;
    // console.log(id, data);
        branchModel.updateBranch(branch_id, data, (err, user) => {
      if (err) {
        // console.log(err);
        throw new ApiError(500, err.message);
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "branch updated successfully",
          data: user,
        });
      }
    });
  };

  
  

  module.exports = {
        createBranch,
        getAllBranch,
        updateBranch
  };
  