const JobPosting = require("../models/JobPosting"); // Assuming JobPosting is exported from models
const JobRole = require("../models/JobRole");

// Create a new job posting
const createJobPosting = async (req, res) => {
  try {
    const {
      jobRole,
      title,
      description,
      requirements,
      benefits,
      location,
      employmentType,
      skills,
      closeDate,
    } = req.body;

    // Optionally pull skills from the job role if not provided
    const jobRoleDoc = await JobRole.findById(jobRole);
    if (!jobRoleDoc)
      return res.status(404).json({ message: "Job role not found" });

    const posting = await JobPosting({
      jobRole,
      title: title || jobRoleDoc.title,
      description,
      requirements,
      benefits,
      location,
      employmentType,
      skills: skills || jobRoleDoc.skills || [],
      postedBy: req.user._id,
      closeDate,
    });

    await posting.save();

    res.status(201).json({ posting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create job posting" });
  }
};

// Get all job postings (with optional filters)
const getAllJobPostings = async (req, res) => {
  try {
    const { status = "open" } = req.query;
    const postings = await JobPosting.find({ status })
      .populate("jobRole")
      .populate("postedBy", "name email");
    res.json(postings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job postings" });
  }
};

// Get a single job posting by ID
const getJobPostingById = async (req, res) => {
  try {
    const posting = await JobPosting.findById(req.params.id)
      .populate("jobRole")
      .populate("postedBy", "name email");
    if (!posting)
      return res.status(404).json({ message: "Job posting not found" });
    res.json(posting);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job posting" });
  }
};

// Close a job posting
const closeJobPosting = async (req, res) => {
  try {
    const posting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { status: "closed", closeDate: new Date() },
      { new: true }
    );
    if (!posting)
      return res.status(404).json({ message: "Job posting not found" });
    res.json({ message: "Job posting closed", posting });
  } catch (err) {
    res.status(500).json({ message: "Failed to close job posting" });
  }
};

module.exports = {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  closeJobPosting,
};
