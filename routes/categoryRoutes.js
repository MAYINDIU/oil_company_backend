const express = require("express");
const categoryController = require("../controllers/categoryController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-category", categoryController.getAllCategory);
router.post("/create-category", categoryController.createCategory);
router.patch("/update-category/:category_id", categoryController.updateCategory);




module.exports = router;
