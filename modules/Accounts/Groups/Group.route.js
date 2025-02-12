const express = require("express");
const router = express.Router();
const accMainController = require("./Group.controller");
const authMiddleware = require("../../../middlewares/authMiddleware.js");

router
  .post(
    "/create_acc_main",
    authMiddleware(["admin", "user"]),
    accMainController.createData
  )
  .get(
    "/all_acc_main",
    authMiddleware(["admin", "user"]),
    accMainController.getAllData
  )
  .get(
    "/acc_main/:id",
    // authMiddleware(["admin", "user"]),
    accMainController.getDataById
  )
  .patch(
    "/acc_main_update/:id",
    authMiddleware(["admin"]),
    accMainController.updateDataById
  )
  .delete(
    "/acc_main_delete/:id",
    authMiddleware(["admin"]),
    accMainController.deleteDataById
  );

module.exports = router;
