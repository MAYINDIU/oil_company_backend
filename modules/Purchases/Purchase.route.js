const express = require("express");
const purchaserateController = require("./Purchase.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.post("/create-purchase-rate", purchaserateController.createPurchaseRate);
router.get("/all-purchase-rate", purchaserateController.getAllPurchaseData);
router.patch("/update-purchase/:id", purchaserateController.updatePurchase);
module.exports = router;
