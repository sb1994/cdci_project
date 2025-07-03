const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  deleteProperty,
  updateProperty,
} = require("../controllers/propertyController");
const passport = require("passport");
const { verifyAdminOrAgent } = require("../utils/utils");
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  verifyAdminOrAgent,
  createProperty
);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  verifyAdminOrAgent,
  updateProperty
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  verifyAdminOrAgent,
  deleteProperty
);

module.exports = router;
