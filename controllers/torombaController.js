const ApiError = require("../errors/APIError");
const torombaModel = require("../models/torombaModel");
const db = require("../config/db");
const sendResponse = require("../utilities/sendResponse");
    
    
const createToromba = async (req, res) => {
    try {
        const { station_id, fuel_type, torombo_no, torombo_op_b, torombo_close_balance } = req.body;

        // Ensure all required fields are present
        // if (!station_id || !fuel_type || !torombo_no || torombo_op_b === undefined || torombo_close_balance === undefined) {
        //     return res.status(400).json({ error: 'Missing required fields' });
        // }

        const saveData = {
            station_id,
            fuel_type,
            torombo_no,
            torombo_op_b,
            torombo_close_balance,
        };

        // Assuming torombaModel.createToromba is a function that accepts saveData and returns a Promise
        torombaModel.createToromba(saveData, (err, result) => {
            if (err) {
                console.error('Error inserting Toromba data:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(201).json({
                success: true,
                message: 'Toromba created successfully',
                torombaId: result.insertId, // Ensure your model returns `insertId`
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: error.message });
    }
};



  function getAllToromba(req, res) {
    torombaModel.getAllToromba((err, toromba) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Fetched all Toromba successfully",
          data: toromba,
        });
      }
    });
  }


  const updateToromba= async (req, res) => {
    const { toromba_id } = req.params;

    const { ...data } = req.body;
    // console.log(id, data);
    torombaModel.updateToromba(toromba_id, data, (err, user) => {
      if (err) {
        // console.log(err);
        throw new ApiError(500, err.message);
      } else {
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Toromba updated successfully",
          data: user,
        });
      }
    });
  };

  
  

  module.exports = {
        createToromba,
        getAllToromba,
        updateToromba
  };
  