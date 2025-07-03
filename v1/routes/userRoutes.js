const express = require("express");
const logger = require("../utils/logger");
const {
  createAdminUser,
  loginUser,
  getUserById,
  getAllUsers,
} = require("../controllers/userController");
const passport = require("passport");
const router = express.Router();

//login user
router.post("/login", loginUser);
router.get("/", passport.authenticate("jwt", { session: false }), getAllUsers);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getUserById
);

router.post("/admin", createAdminUser);

module.exports = router;
