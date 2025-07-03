const JobApplication = require("../models/JobApplication");
const JobPosting = require("../models/JobPosting");
const JobRole = require("../models/JobRole");

// Create a new job application
const createJobApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      linkedIn,
      portfolio,
      jobPosting,
      position,
      cv,
      coverLetter,
    } = req.body;

    // Ensure jobPosting and position exist
    const posting = await JobPosting.findById(jobPosting);
    const role = await JobRole.findById(position);

    if (!posting || !role) {
      return res
        .status(404)
        .json({ message: "Invalid job posting or job role" });
    }

    const newApplication = new JobApplication({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      linkedIn,
      portfolio,
      jobPosting,
      position,
      cv,
      coverLetter,
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    console.error("Error creating job application:", err);
    res.status(500).json({ message: "Server error creating job application" });
  }
};

// Get all applications (admin or HR only)
const getAllJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobPosting")
      .populate("position");
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching job applications:", err);
    res.status(500).json({ message: "Server error fetching job applications" });
  }
};

// Get application by ID
const getJobApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id)
      .populate("jobPosting")
      .populate("position");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({ message: "Server error fetching job application" });
  }
};

module.exports = {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
};
