const express = require("express");
const userController = require("./Users.controller");
const authMiddleware = require("../../middlewares/authMiddleware");
const router = express.Router();

// Prefix all routes with '/api'
router.get(
  "/allUsers",
  authMiddleware(["admin", "user"]),
  userController.getAllUsers
);
router.get("/getUser/:id", userController.getSingleUser);
router.post("/register", userController.register);
router.post("/signin", userController.login);
router.patch(
  "/update-user/:id",
  authMiddleware(["admin"]),
  userController.updateUser
);
router.put(
  "/check-password/:id",

  userController.userCheckPassword
);
router.put("/change-password/:id", userController.changePassword);
router.delete(
  "/delete-user/:id",
  authMiddleware(["admin"]),
  userController.deleteUserById
);

module.exports = router;
