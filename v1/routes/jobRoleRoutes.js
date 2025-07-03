const express = require("express");
const router = express.Router();
const {
  createJobRole,
  approveJobRole,
  getJobRoles,
  getJobRoleById,
} = require("../controllers/jobRoleController");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createJobRole
);
router.patch(
  "/:id/approve",
  passport.authenticate("jwt", { session: false }),
  approveJobRole
);
router.get("/", passport.authenticate("jwt", { session: false }), getJobRoles);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getJobRoleById
);

module.exports = router;
