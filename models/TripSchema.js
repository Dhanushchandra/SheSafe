const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startLocation: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  endLocation: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  currentstate: {
    intoxicated: {
      type: Boolean,
      required: true,
    },
    feelingUnwell: {
      type: Boolean,
      required: true,
    },
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Trip", tripSchema);
