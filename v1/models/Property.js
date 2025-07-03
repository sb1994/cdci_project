const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  type: {
    type: String,
    enum: ["apartment", "house", "condo", "commercial"],
    required: true,
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFeet: { type: Number },
  yearBuilt: { type: Number },
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Agent/Admin who listed the property
  status: {
    type: String,
    enum: ["available", "pending", "sold"],
    default: "available",
  },
  images: [{ type: String }], // Array of image URLs
  createdAt: { type: Date, default: Date.now },
});

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
