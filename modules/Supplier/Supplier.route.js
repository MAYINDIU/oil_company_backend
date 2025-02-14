const express = require("express");
const supplierController = require("./Supplier.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-supplier", supplierController.getAllSupplier);
router.post("/create-supplier", supplierController.createSupplier);
router.patch(
  "/update-supplier/:supplier_id",
  supplierController.updateSupplier
);

module.exports = router;
