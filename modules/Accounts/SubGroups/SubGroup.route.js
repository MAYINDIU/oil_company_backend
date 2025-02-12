const express = require("express");
const router = express.Router();
const accSubController = require("./SubGroup.controller");
const authMiddleware = require("../../../middlewares/authMiddleware.js");

router
  .post(
    "/create_acc_sub",
    authMiddleware(["admin", "user"]),
    accSubController.createData
  )
  .get(
    "/all_acc_sub",
    authMiddleware(["admin", "user"]),
    accSubController.getAllData
  )
  .get(
    "/acc_sub/:id",
    // authMiddleware(["admin", "user"]),
    accSubController.getDataById
  )
  .patch(
    "/acc_sub_update/:id",
    authMiddleware(["admin"]),
    accSubController.updateDataById
  )
  .delete(
    "/acc_sub_delete/:id",
    authMiddleware(["admin"]),
    accSubController.deleteDataById
  );

module.exports = router;
