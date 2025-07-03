// routes/jobPostingRoutes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  createJobPosting,
  getAllJobPostings,
  getJobPostingById,
  closeJobPosting,
} = require("../controllers/jobPostingController");
const { verifyAdminOrHR } = require("../utils/utils");

// router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  verifyAdminOrHR,
  createJobPosting
); // Require HR/Admin middleware if needed
router.get("/", getAllJobPostings);
router.get("/:id", getJobPostingById);
router.patch(
  "/:id/close",
  passport.authenticate("jwt", { session: false }),
  closeJobPosting
);

module.exports = router;
