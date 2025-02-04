const express = require("express");
const userRoutes = require("./routes/userRoutes");
const positionRoutes = require("./routes/positionRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const educationRoutes = require("./routes/educationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const attendanceRoutes = require("./routes/attendanceRoute");
const leave_typesModelRoutes = require("./routes/leaveTypeRoutes");
const leave_applicatoionRoutes = require("./routes/leaveApplicationRoutes");
const salaryadvanceRoutes = require("./routes/salaryadvanceRoutes");



const cors = require("cors");
const path = require("path");
const ErrorHandler = require("./middlewares/ErrorHandler");

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leave_typesModelRoutes);
app.use("/api/leave-application", leave_applicatoionRoutes);
app.use("/api/advsalary", salaryadvanceRoutes);



app.use(ErrorHandler);

app.listen(port, () => {
  console.log(` \n- Date ${new Date()}\n`);
  console.log(`Wow!!Server is running at http://localhost:${port}`);
});



