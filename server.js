const dotenv = require("dotenv").config();
const app = require("./app");
const connection = require("./config/db");

// mysql database connection
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");
});

// server port Connection
const port = process.env.PORT || 6002;

app.listen(port, () => {
  console.log(`App is running on port http://localhost:${port}`);
});
