const express = require("express");
const userController = require("./Users.controller");
const verifyToken = require("../../utilities/verifyToken");
const router = express.Router();

// Prefix all routes with '/api'
router.get("/allUsers", userController.getAllUsers);
router.get("/getUser/:id", userController.getSingleUser);
router.post("/register", userController.register);
router.post("/signin", userController.login);
router.patch("/update-user/:id", userController.updateUser);
router.put(
  "/check-password/:id",
  verifyToken,
  userController.userCheckPassword
);
router.put("/change-password/:id", verifyToken, userController.changePassword);

module.exports = router;
