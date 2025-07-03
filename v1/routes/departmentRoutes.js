const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

// adjust path as needed
const passport = require("passport");
const { verifyAdminOrAgent } = require("../utils/utils");

// Only admins can manage departments
router
  .route("/")
  .post(
    passport.authenticate("jwt", { session: false }),
    verifyAdminOrAgent,
    createDepartment
  )
  .get(
    passport.authenticate("jwt", { session: false }),
    verifyAdminOrAgent,
    getDepartments
  );

router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    verifyAdminOrAgent,
    getDepartmentById
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    verifyAdminOrAgent,
    updateDepartment
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    verifyAdminOrAgent,
    deleteDepartment
  );

module.exports = router;
