const Department = require("../v1/models/Department"); // Adjust the path as needed
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const departments = [
  {
    name: "Executive Suite",
    description: "Responsible for overall company strategy and leadership.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Sales",
    description:
      "Handles client acquisition, property sales, and relationship management.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Lettings",
    description: "Manages rental properties, tenants, and lease agreements.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Property Management",
    description:
      "Oversees maintenance, inspections, and tenant support for managed properties.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Marketing",
    description:
      "Promotes properties and brand through advertising and social media.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Legal & Compliance",
    description:
      "Ensures legal compliance with property laws, contracts, and internal policies.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Finance",
    description:
      "Manages billing, payroll, commissions, and financial planning.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Human Resources",
    description:
      "Handles recruitment, employee relations, and organizational structure.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Customer Support",
    description:
      "Assists clients and tenants with inquiries and service-related issues.",
    lead: "67aa7a8547aa4ed588686c23",
  },
  {
    name: "Technology",
    description:
      "Manages software, platform infrastructure, and system support.",
    lead: "67aa7a8547aa4ed588686c23",
  },
];

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

async function seedDepartments() {
  try {
    console.log("Thiis is the seader script");

    await Department.deleteMany(); // Clear existing departments if any
    await Department.insertMany(departments); // Insert the new departments
    console.log("Departments seeded successfully!");
  } catch (error) {
    console.error("Error seeding departments:", error);
  }
}

seedDepartments();
