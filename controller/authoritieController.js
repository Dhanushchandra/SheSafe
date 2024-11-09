const Authoritie = require("../models/AuthoritieSchema");
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
  }).populate("trip");

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