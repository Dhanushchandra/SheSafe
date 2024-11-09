const fs = require("fs");
const path = require("path");

const Contact = require("../models/ContactSchema");
const LiveSchema = require("../models/LiveSchema");
const SoS = require("../models/SosSchema");
const Trip = require("../models/TripSchema");

const { generateToken } = require("../utils/helpers/tokenGenerate");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Contact.findOne({
    email,
  }).populate("dependent");

  if (!user) {
    res.status(401).send({
      message: "Login failed",
    });
    return;
  }

  if (user.password == password) {
    const token = await generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    res.status(200).send({
      message: "Login success",
      data: user,
      token,
    });
  }
};

exports.getDependent = async (req, res) => {
  const cid = req.params.cid;

  const user = await Contact.findOne({
    _id: cid,
  }).populate("dependent");

  if (!user) {
    res.status(404).send({
      message: "Not Found",
    });
    return;
  }

  res.status(404).send({
    message: "Found user",
    data: user.dependent,
  });
};

exports.getDependentTrip = async (req, res) => {
  const userId = req.params.uid;

  const trip = await Trip.findOne({
    userId,
    status: true,
  });

  if (!trip) {
    res.status(404).send({
      message: "Trip not found",
    });
    return;
  }

  res.status(200).send({
    message: "Trip found",
    data: trip,
  });
};

exports.triggerSos = async (req, res) => {
  const tid = req.params.tid;

  const sos = new SoS({
    trip: tid,
    from: "contact",
  });
  await sos.save();

  res.status(200).send({
    message: "SOS Sent",
  });
};

exports.getLiveLocation = async (req, res) => {
  const tid = req.params.tid;

  const location = await LiveSchema.findOne({
    trip: tid,
  });

  if (!location) {
    res.status(400).send({
      message: "Location not found",
    });
    return;
  }

  res.status(400).send({
    message: "Location found",
    data: location,
  });
};

//Get Image

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // format as YYYY-MM-DD
};

exports.getSosPhotos = async (req, res) => {
  const { uid } = req.params;
  const uploadsFolder = path.join(__dirname, "../uploads");
  const todayDate = getTodayDateString();

  fs.readdir(uploadsFolder, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading uploads directory" });
    }

    const todayFile = files.find((file) => {
      const [fileUid, fileTimestamp] = file.split("_");
      const fileDate = new Date(parseInt(fileTimestamp, 10))
        .toISOString()
        .split("T")[0];
      return fileUid === uid && fileDate === todayDate;
    });

    if (!todayFile) {
      return res.status(404).json({ message: "No photo found for today" });
    }

    const filePath = path.join(uploadsFolder, todayFile);
    res.sendFile(filePath);
  });
};
