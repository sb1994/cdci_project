const Property = require("../models/Property");
const logger = require("../utils/logger"); // Winston Logger

/**
 * @desc Create a Property
 * @route POST /api/properties
 * @access Private (Agent/Admin)
 */
const createProperty = async (req, res) => {
  try {
    const property = new Property({ ...req.body, listedBy: req.body.listedBy });
    await property.save();
    logger.info(`Property created: ${property._id} by ${req.body.listedBy}`);
    res
      .status(201)
      .json({ message: "Property created successfully", property: req.body });
  } catch (error) {
    logger.error(`Error creating property: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error creating property", error: error.message });
  }
};

/**
 * @desc Get All Properties
 * @route GET /api/properties
 * @access Public
 */
const getAllProperties = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status = "available",
      sort = "-createdAt",
      minPrice,
      maxPrice,
      type,
      city,
    } = req.query;
    console.log(page);

    // Convert page & limit to numbers
    page = parseInt(page);
    limit = parseInt(limit);

    // Construct the filter query
    let filter = { status };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (type) filter.type = type;
    if (city) filter.city = { $regex: new RegExp(city, "i") }; // Case-insensitive city match

    // Get total properties count for pagination
    const totalProperties = await Property.countDocuments(filter);

    // Fetch properties with pagination & sorting
    const properties = await Property.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "title price city state country type bedrooms bathrooms squareFeet status createdAt images"
      );

    // console.log(properties);

    res.status(200).json({
      success: true,
      count: properties.length,
      page,
      totalPages: Math.ceil(totalProperties / limit),
      data: properties,
    });
  } catch (error) {
    logger.error(`Error fetching properties: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

/**
 * @desc Get Single Property by ID
 * @route GET /api/properties/:id
 * @access Public
 */
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    logger.error(`Error fetching property ${req.params.id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching property", error: error.message });
  }
};

/**
 * @desc Update a Property
 * @route PUT /api/properties/:id
 * @access Private (Only Owner Agent/Admin)
 */
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    // Allow only listing agent or admin to update
    if (
      req.user.roles.includes("agent") &&
      property.listedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only update your own listings" });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    logger.info(`Property updated: ${req.params.id} by ${req.user._id}`);
    res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    logger.error(`Error updating property ${req.params.id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error updating property", error: error.message });
  }
};

/**
 * @desc Delete a Property
 * @route DELETE /api/properties/:id
 * @access Private (Only Owner Agent/Admin)
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (
      req.user.roles.includes("agent") &&
      property.listedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own listings" });
    }

    await Property.findByIdAndDelete(req.params.id);
    logger.info(`Property deleted: ${req.params.id} by ${req.user._id}`);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting property ${req.params.id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error deleting property", error: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
