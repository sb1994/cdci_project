const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  linkedIn: { type: String },
  portfolio: { type: String },

  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPosting",
    required: true,
  },

  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobRole",
    required: true,
  },

  coverLetter: {
    fileUrl: { type: String }, // Cloud storage URL
    fileName: { type: String },
    uploadedAt: { type: Date },
  },

  cv: {
    fileUrl: { type: String }, // Cloud storage URL
    fileName: { type: String },
    uploadedAt: { type: Date },
  },

  status: {
    type: String,
    enum: [
      "submitted",
      "shortlisted",
      "in_review",
      "interview",
      "offered",
      "hired",
      "rejected",
    ],
    default: "submitted",
  },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // HR/Admin user
  contractId: { type: String }, // DocuSign envelope ID
  contractStatus: {
    type: String,
    enum: ["sent", "delivered", "signed", "completed", "declined", "voided"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

module.exports = JobApplication;
