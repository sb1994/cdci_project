const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the User model (i.e., the lead for this department)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
