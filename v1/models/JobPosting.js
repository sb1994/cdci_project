// Job Posting Model

const mongoose = require("mongoose");

const JobPostingSchema = new mongoose.Schema({
  jobRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobRole",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  location: { type: String },
  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract"],
    default: "full-time",
  },
  skills: [{ type: String }], // Can default from JobRole or be customized
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  openDate: { type: Date, default: Date.now },
  closeDate: { type: Date },
});

const JobPosting = mongoose.model("JobPosting", JobPostingSchema);

module.exports = JobPosting;
