const express = require("express");
require("./loadEnv");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { traceMiddleware } = require("./v1/utils/utils");
app.use(traceMiddleware);

const passport = require("./v1/utils/passport");

const userRoutesV1 = require("./v1/routes/userRoutes");
const propertyRoutesV1 = require("./v1/routes/propertyRoutes");
const departmentRoutesV1 = require("./v1/routes/departmentRoutes");
const jobRoleRoutesV1 = require("./v1/routes/jobRoleRoutes");
const jobPostingRoutesV1 = require("./v1/routes/jobPostingRoutes");
const jobApplicationRoutesV1 = require("./v1/routes/jobApplicationRoutes");

const { default: mongoose } = require("mongoose");
const { docusignWebhook } = require("./v1/controllers/webhookController");

app.use(passport.initialize());
// Mongo DB Connections

mongoose
  .connect(
    process.env.DB_URI || "mongodb://localhost:27017/boyler_real_estate",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log("MongoDB Connection Succeeded.");
    console.log(process.env.DB_URI);
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });

// Middleware Connections
app.use(cors());
app.use(express.json());

//test route
//version 1
app.use("/api/v1/users", userRoutesV1);
app.use("/api/v1/properties", propertyRoutesV1);
app.use("/api/v1/departments", departmentRoutesV1);
app.use("/api/v1/jobroles", jobRoleRoutesV1);
app.use("/api/v1/jobpostings", jobPostingRoutesV1);
app.use("/api/v1/jobapplications", jobApplicationRoutesV1);

app.post("/webhook/docusign", docusignWebhook);
// Connection
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("App running in port: " + PORT);
});
