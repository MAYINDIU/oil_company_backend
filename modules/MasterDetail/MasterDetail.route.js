const express = require("express");
const mdetilController = require("./MasterDetail.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.post("/create-master-detail", mdetilController.createMasterDetail);
router.get("/master-details", mdetilController.getSingleMdetail);
router.get("/fueltype-details", mdetilController.getFueltypeMdetail);
router.post("/update-reading", mdetilController.createOrUpdateMasterData);

module.exports = router;
