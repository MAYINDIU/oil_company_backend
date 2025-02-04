const express = require("express");
const branchController = require("../controllers/branchController");
const verifyToken = require('../utilities/verifyToken');
const router = express.Router();

// Prefix all routes with '/api'
router.get("/all-branch", branchController.getAllBranch);
router.post("/create-branch", branchController.createBranch);
router.patch("/update-branch/:branch_id", branchController.updateBranch);




module.exports = router;
