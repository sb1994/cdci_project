const Department = require("../models/Department");
// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description, lead } = req.body;

    if (!name || !description || !lead) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const department = new Department({ name, description, lead });
    await department.save();

    logger.info(
      `Department created: ${name} by user ${req.user?.id || "unknown"}`
    );

    res.status(201).json(department);
  } catch (err) {
    logger.error("Error creating department:", err);
    res.status(500).json({ message: "Server error creating department" });
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate(
      "lead",
      "lName fName email"
    );
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get a single department
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "lead",
      "lName fName email"
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (err) {
    logger.error("Error fetching department:", err);
    res.status(500).json({ message: "Server error fetching department" });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const updates = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    logger.info(
      `Department updated: ${req.params.id} by user ${
        req.user?.id || "unknown"
      }`
    );

    res.status(200).json(department);
  } catch (err) {
    logger.error("Error updating department:", err);
    res.status(500).json({ message: "Server error updating department" });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    logger.info(
      `Department deleted: ${req.params.id} by user ${
        req.user?.id || "unknown"
      }`
    );

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    logger.error("Error deleting department:", err);
    res.status(500).json({ message: "Server error deleting department" });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
