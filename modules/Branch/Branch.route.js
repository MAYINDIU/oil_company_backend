const express = require("express");
const branchController = require("./Branch.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-branch", branchController.getAllBranch);
router.post("/create-branch", branchController.createBranch);
router.patch("/update-branch/:branch_id", branchController.updateBranch);

module.exports = router;
