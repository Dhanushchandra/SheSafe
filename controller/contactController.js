const Contact = require("../models/ContactSchema");
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
