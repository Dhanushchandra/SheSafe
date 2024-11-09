const User = require("../models/UserSchema");
const Trip = require("../models/TripSchema");
const {
  hashPassword,
  comparePassword,
} = require("../utils/helpers/hashPassword");

const { generateToken } = require("../utils/helpers/tokenGenerate");

exports.userSignup = async (req, res) => {
  const { username, email, password, phone, aadhar, medicals } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await User({
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    aadhar,
    medicals,
  });

  await user.save();

  res.send({
    message: "saved",
  });
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(400).send({
      messege: "Username or Password is wrong",
    });
    return;
  }

  if (comparePassword(password, user.password)) {
    const token = await generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
    });

    res.status(400).send({
      message: "Login Success",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        aadhar: user.aadhar,
      },
      token,
    });
  }
};

exports.startTrip = async (req, res) => {
  const userId = req.params["uid"];
  const { startLocation, endLocation, currentstate } = req.body;

  const trip = new Trip({
    userId,
    startLocation,
    endLocation,
    currentstate,
  });

  await trip.save();

  res.status(201).send({
    message: "Trip created",
  });
};

exports.getTrips = async (req, res) => {
  const userId = req.params.uid;

  const trips = await Trip.findOne({
    userId,
    status: true,
  });

  if (!trips) {
    res.status(404).send({
      message: "Trips not found",
    });
    return;
  }

  res.status(200).send({
    message: "Success",
    data: trips,
  });
};

exports.cancelTrips = async (req, res) => {
  const tripid = req.params.tid;

  const trip = await Trip.findOneAndUpdate(
    {
      _id: tripid,
    },
    {
      status: false,
    },
    {
      new: true,
    }
  );

  if (!trip) {
    res.status(400).send({
      message: "Update Failed",
    });
    return;
  }

  res.status(200).send({
    message: "Update Success",
    data: trip,
  });
};
