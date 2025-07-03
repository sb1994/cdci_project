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
      title: "Head of Human Resources",
    });
    if (ceoExists) {
      console.log("✅ CEO role already exists. Skipping...");
      return mongoose.disconnect();
    }

    const ceoRole = new JobRole({
      title: "Head of Human Resources",
      baseSalary: 160000,
      lowSalary: 130000,
      highSalary: 180000,
      grade: 12,
      createdBy: "67aa7a8547aa4ed588686c23",
      approvedBy: "67aa7a8547aa4ed588686c23",
      department: "680296b6401d7ec3194f1596",
      hiringManager: "67aa7a8547aa4ed588686c23",
      status: "approved",
    });

    await ceoRole.save();
    console.log("🚀 HR role seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding CEO role:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedCEO();
