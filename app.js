const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
const routes = [
  { path: "/api/users", route: require("./modules/Users/Users.route") },
  {
    path: "/api/supplier",
    route: require("./modules/Supplier/Supplier.route"),
  },
  { path: "/api/branch", route: require("./modules/Branch/Branch.route") },
  {
    path: "/api/category",
    route: require("./modules/Category/Category.route"),
  },
  { path: "/api/toromba", route: require("./modules/Toromba/Toromba.route") },
  { path: "/api/mdetail", route: require("./modules/MasterDetail/MasterDetail.route") },
];

routes.forEach(({ path, route }) => app.use(path, route));

const ErrorHandler = require("./middlewares/ErrorHandler");
app.use(ErrorHandler);

// Home page
app.get("/", (req, res) => {
  res.send(`Wow..!!! Route is Running for Diamond`);
});

module.exports = app;
