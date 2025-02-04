const express = require("express");
const positionController = require("../controllers/positionController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allPosition", positionController.getAllposition);
router.post("/create-position", positionController.createPosition);
router.patch("/update-position/:id", positionController.updatePosition);
router.delete("/delete-position/:id", positionController.removePosition);
router.get("/single-position/:id", positionController.singlePosition);

module.exports = router;
