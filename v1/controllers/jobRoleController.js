const JobRole = require("../models/JobRole");

// Create a new job role
const createJobRole = async (req, res) => {
  try {
    const { title, department, lowSalary, highSalary, grade, hiringManager } =
      req.body;

    const newJobRole = new JobRole({
      title,
      department,
      lowSalary,
      highSalary,
      grade,
      hiringManager: hiringManager || null,
      createdBy: req.user._id,
      status: "pending",
    });

    const savedRole = await newJobRole.save();
    res.status(201).json({ savedRole });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating job role", error: err.message });
  }
};

// Approve a job role
const approveJobRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await JobRole.findById(id);
    if (!role) return res.status(404).json({ message: "Job role not found" });

    role.status = "approved";
    role.approvedBy = req.user._id;

    const updated = await role.save();
    res.json({ message: "Job role approved", role: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error approving job role", error: err.message });
  }
};

// Get all job roles (with optional filters)
const getJobRoles = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.department) filters.department = req.query.department;

    const roles = await JobRole.find(filters)
      .populate("department", "name")
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email")
      .populate("hiringManager", "name email");

    res.json(roles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching job roles", error: err.message });
  }
};

// Get a single job role by ID
const getJobRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await JobRole.findById(id)
      .populate("department", "name")
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email")
      .populate("hiringManager", "name email");

    if (!role) return res.status(404).json({ message: "Job role not found" });
    res.json(role);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching job role", error: err.message });
  }
};

module.exports = {
  createJobRole,
  approveJobRole,
  getJobRoles,
  getJobRoleById,
};
