const express = require("express");
const router = express.Router();
const shabakaDataController = require("./ShabakaData.controller.js");
const authMiddleware = require("../../middlewares/authMiddleware.js");

router
  .post(
    "/create_shabaka_data",
    authMiddleware(["admin", "user"]),
    shabakaDataController.createData
  )
  .get(
    "/all_shabaka_data",
    authMiddleware(["admin", "user"]),
    shabakaDataController.getAllData
  )
  .get(
    "/shabaka_data/:id",
    // authMiddleware(["admin", "user"]),
    shabakaDataController.getDataById
  )
  .patch(
    "/shabaka_data_update/:id",
    authMiddleware(["admin"]),
    shabakaDataController.updateDataById
  )
  .delete(
    "/shabaka_data_delete/:id",
    authMiddleware(["admin"]),
    shabakaDataController.deleteDataById
  )
  .get(
    "/shebaka-station-wise-report",
    shabakaDataController.getShebakaStationReport
  );

module.exports = router;
