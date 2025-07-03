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
      title: "Chief Executive Officer",
    });
    if (ceoExists) {
      console.log("✅ CEO role already exists. Skipping...");
      return mongoose.disconnect();
    }

    const ceoRole = new JobRole({
      title: "Chief Executive Officer",
      department: "680296b6401d7ec3194f1596", // Example department ID
      lowSalary: 150000,
      highSalary: 300000,
      grade: 12,
      hiringManager: null,
      createdBy: "67aa7a8547aa4ed588686c23",
      approvedBy: "67aa7a8547aa4ed588686c23",
      status: "approved",
    });

    await ceoRole.save();
    console.log("🚀 CEO role seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding CEO role:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedCEO();
