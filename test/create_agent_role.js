require("dotenv").config(); // Load your env (dev or prod)
const mongoose = require("mongoose");
const JobRole = require("../v1/models/JobRole"); // Adjust path if needed

const seedCEO = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const ceoExists = await JobRole.findOne({
      title: "Estate Agent",
    });
    if (ceoExists) {
      console.log("✅ Real Estate Agent role already exists. Skipping...");
      return mongoose.disconnect();
    }

    // const ceoRole = new JobRole({
    //   title: "Chief Financial Officer",
    //   baseSalary: 200000,
    //   lowSalary: 180000,
    //   highSalary: 250000,
    //   grade: 1,
    //   createdBy: "67aa7a8547aa4ed588686c23",
    //   approvedBy: "67aa7a8547aa4ed588686c23",
    //   department: "680296b6401d7ec3194f1596",
    //   hiringManager: "67aa7a8547aa4ed588686c23",
    //   status: "approved",
    // });
    const ceoRole = new JobRole({
      title: "Estate Agent",
      baseSalary: 35000,
      lowSalary: 30000,
      highSalary: 60000,
      grade: 5,
      createdBy: "67aa7a8547aa4ed588686c23",
      department: "680296b6401d7ec3194f1597", // Sales department ID
      hiringManager: "67aa7a8547aa4ed588686c23",
      status: "approved",
      approvedBy: "67aa7a8547aa4ed588686c23",
    });

    await ceoRole.save();
    console.log("🚀 CFO role seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding CEO role:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedCEO();
