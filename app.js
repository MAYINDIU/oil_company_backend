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
  {
    path: "/api/mdetail",
    route: require("./modules/MasterDetail/MasterDetail.route"),
  },
  {
    path: "/api/rate",
    route: require("./modules/Purchases/Purchase.route"),
  },

  // Accounts Module Part start
  { path: "/api", route: require("./modules/Accounts/Groups/Group.route") },
  {
    path: "/api",
    route: require("./modules/Accounts/SubGroups/SubGroup.route"),
  },
  { path: "/api", route: require("./modules/Accounts/Ledger/Ledger.rotue") },
  { path: "/api", route: require("./modules/Accounts/Vouchers/Voucher.route") },
  // Accounts Module Part end

  {
    path: "/api/expense-item",
    route: require("./modules/ExpenseItem/ExpenseItem.route"),
  },
  {
    path: "/api/expense-amount",
    route: require("./modules/StationExpense/StationExpense.route"),
  },
  {
    path: "/api/master-data",
    route: require("./modules/MasterSummary/MasterSummary.route"),
  },
];

routes.forEach(({ path, route }) => app.use(path, route));

const ErrorHandler = require("./middlewares/ErrorHandler");
app.use(ErrorHandler);

// Home page
app.get("/", (req, res) => {
  res.send(`Wow..!!! Route is Running for Diamond`);
});

module.exports = app;
