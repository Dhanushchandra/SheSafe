const mongoose = require("mongoose");

const SosSchema = mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  from: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("SoS", SosSchema);
