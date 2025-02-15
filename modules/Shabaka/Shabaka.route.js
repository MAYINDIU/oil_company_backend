const express = require("express");
const router = express.Router();
const shabakaController = require("./Shabaka.controller.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");

router
  .post(
    "/create_shabaka",
    authMiddleware(["admin", "user"]),
    shabakaController.createData
  )
  .get(
    "/all_shabaka",
    // authMiddleware(["admin", "user"]),
    shabakaController.getAllData
  )
  .get(
    "/shabaka/:id",
    // authMiddleware(["admin", "user"]),
    shabakaController.getDataById
  )
  .patch(
    "/shabaka_update/:id",
    authMiddleware(["admin"]),
    shabakaController.updateDataById
  )
  .delete(
    "/shabaka_delete/:id",
    authMiddleware(["admin"]),
    shabakaController.deleteDataById
  );

module.exports = router;
