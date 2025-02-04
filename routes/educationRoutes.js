const express = require("express");
const educationController = require("../controllers/educationController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allUniversity", educationController.getAlluniversity);
router.get("/allEducation", educationController.getAlleducation);
router.post("/create-education", educationController.createEducation);
router.patch("/update-employee/:id", educationController.updateeducation);
router.delete("/delete-employee/:id", educationController.removeeducation);
router.get("/single-employee/:id", educationController.singleEducationdata);
module.exports = router;
