const express = require("express");
const router = express.Router();
const {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
} = require("../controllers/jobApplicationController");

// You can optionally add authentication middleware here
// const { authenticateUser, authorizeRoles } = require('../middleware/auth');

router.post("/", createJobApplication); // Public endpoint to apply
router.get(
  "/",
  /* authenticateUser, authorizeRoles(['admin', 'hr']), */ getAllJobApplications
); // Restricted
router.get(
  "/:id",
  /* authenticateUser, authorizeRoles(['admin', 'hr']), */ getJobApplicationById
); // Restricted

module.exports = router;
