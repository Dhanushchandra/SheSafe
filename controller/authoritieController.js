const fs = require("fs");
const path = require("path");

const Authoritie = require("../models/AuthoritieSchema");
const LiveSchema = require("../models/LiveSchema");
const SoS = require("../models/SosSchema");

const { generateToken } = require("../utils/helpers/tokenGenerate");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await Authoritie.findOne({
    username,
  });

  if (!user) {
    res.status(401).send({
      message: "Login failed",
    });
    return;
  }

  if (user.password == password) {
    const token = await generateToken({
      id: user._id,
      username: user.username,
    });

    res.status(200).send({
      message: "Login success",
      data: user,
      token,
    });
  }
};

exports.sosList = async (req, res) => {
  const sos = await SoS.find({
    status: true,
  })
    .populate("trip")
    .populate("userId");

  if (!sos) {
    res.status(404).send({
      message: "No SoS Found",
    });
    return;
  }

  res.status(200).send({
    message: "SoS Found",
    data: sos,
  });
};

exports.updateSos = async (req, res) => {
  const sid = req.params.sid;

  const updateSos = await SoS.updateOne(
    {
      _id: sid,
    },
    {
      status: false,
    },
    {
      new: true,
    }
  );

  if (!updateSos) {
    res.status(400).send({
      message: "Update Failed",
    });
    return;
  }

  res.status(200).send({
    message: "Update Success",
    data: updateSos,
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
