const express = require("express");
const experienceController = require("../controllers/experienceController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allExperience", experienceController.getAllexperience);
router.post("/create-experience", experienceController.createexperience);
router.patch("/update-experience/:id", experienceController.updateexperience);
router.delete("/delete-experience/:id", experienceController.removeexperience);
router.get("/single-experience/:id", experienceController.singleexperiencedata);
module.exports = router;
