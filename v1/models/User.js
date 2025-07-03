const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Only for buyers
  //   auth0Id: { type: String, unique: true, sparse: true }, // For employees & admins
  role: [
    {
      type: String,
      enum: ["buyer", "employee", "admin", "manager"],
      required: true,
      default: "buyer",
    },
  ],
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String, default: "Ireland" },
  phone: { type: String },
  contractSent: { type: Boolean },
  startDate: { type: String },
  contractSigned: { type: Boolean }, // Track if contract has been signed
  managerSigned: { type: Boolean }, // Track if contract has been signed

  docusignContractId: { type: String }, // Store the DocuSign envelope ID
  accountActive: { type: Boolean, default: false },
  jobRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobRole",
  },
  salary: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    required: function () {
      return this.role !== "buyer";
    },
    default: 0,
  },
  permissions: [{ type: String }], // List of specific permissions
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
