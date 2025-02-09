const express = require("express");
const torombaController = require("./Toromba.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-toromba", torombaController.getAllToromba);
router.post("/create-toromba", torombaController.createToromba);
router.patch("/update-toromba/:toromba_id", torombaController.updateToromba);
router.get("/toromba", torombaController.getSingleStationwiseToromba);

router.get("/toromba-rate", torombaController.getToromboRate);

module.exports = router;
