const ApiError = require("../errors/APIError");
const categoryModel = require("../models/categoryModel");
const db = require("../config/index.js");
const sendResponse = require("../utilities/sendResponse");
    
    
const createCategory = async (req, res) => {
    try {
      const { category_name } = req.body;
      if (!category_name) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const saveData = {
        category_name: category_name
      };
      categoryModel.createCategory(saveData, (err, result) => {
        if (err) {
          // Log the error for debugging
          console.error('Error inserting Category data:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({
          success: true,
          message: 'Category created successfully',
          userId: result.insertId, // Assuming `insertId` is the ID of the newly created supplier
        });
      });
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      res.status(500).json({ error: error.message });
    }
  };


  function getAllCategory(req, res) {
    categoryModel.getAllCategory((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Fetched all category successfully",
          data: users,
        });
      }
    });
  }


  const updateCategory= async (req, res) => {
    const { category_id } = req.params;

    const { ...data } = req.body;
    // console.log(id, data);
    categoryModel.updateCategory(category_id, data, (err, user) => {
      if (err) {
        // console.log(err);
        throw new ApiError(500, err.message);
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "category updated successfully",
          data: user,
        });
      }
    });
  };

  
  

  module.exports = {
        createCategory,
        getAllCategory,
        updateCategory
  };
  