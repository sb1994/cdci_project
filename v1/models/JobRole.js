const mongoose = require("mongoose");

const JobRoleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  lowSalary: { type: Number, required: true },
  highSalary: { type: Number, required: true },
  grade: { type: Number, required: true, min: 1, max: 12 },
  hiringManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // usually a Head of Department
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobRole = mongoose.model("JobRole", JobRoleSchema);
module.exports = JobRole;
