const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../v1/models/User");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Mongo DB Connections
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });

const createAdminUser = async () => {
  const newUser = new User({});

  const existingUser = await User.findOne({
    email: "boylerhr@gmail.com",
  }).select("+password");

  console.log(existingUser);

  //   await console.log("hello world");
};

createAdminUser();
