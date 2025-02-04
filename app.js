const express = require("express");
const userRoutes = require("./routes/userRoutes");


const cors = require("cors");
const path = require("path");
const ErrorHandler = require("./middlewares/ErrorHandler");

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);




app.use(ErrorHandler);

app.listen(port, () => {
  console.log(` \n- Date ${new Date()}\n`);
  console.log(`Wow!!Server is running at http://localhost:${port}`);
});



