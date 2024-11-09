const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  aadhar: {
    type: Number,
    required: true,
  },
  mailVerify: {
    type: Boolean,
    default: false,
  },
  kycVerify: {
    type: Boolean,
    default: false,
  },
  medicals: {
    hasAllergies: {
      type: Boolean,
      default: false,
    },
    hasPreExistingConditions: {
      type: Boolean,
      default: false,
    },
    requiresRegularMedication: {
      type: Boolean,
      default: false,
    },
    requiresEmergencyTreatment: {
      type: Boolean,
      default: false,
    },
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
  trip: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
