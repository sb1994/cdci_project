const express = require("express");
const router = express.Router();
const {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  addApplicantShortlist,
  getShortlistedApplicantsByJobPostingID,
  rejectJobApplication,
} = require("../controllers/jobApplicationController");
const passport = require("passport");
const { verifyAdminOrHR } = require("../utils/utils");
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
router.post(
  "/:app_id/shortlist",
  passport.authenticate("jwt", { session: false }),
  // verifyAdminOrHR(["admin", "hr"]),
  addApplicantShortlist
); // Restricted
router.get(
  "/shortlist/:job_posting_id",
  passport.authenticate("jwt", { session: false }),
  // verifyAdminOrHR,
  getShortlistedApplicantsByJobPostingID
); // Restricted

router.post(
  "/:app_id/reject",
  passport.authenticate("jwt", { session: false }),
  // verifyAdminOrHR,
  rejectJobApplication
); // Restricted
module.exports = router;
