const User = require("../models/UserSchema");
const Trip = require("../models/TripSchema");
const Contact = require("../models/ContactSchema");
const LiveSchema = require("../models/LiveSchema");
const SoS = require("../models/SosSchema");

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

    res.status(200).send({
      message: "Login Success",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        aadhar: user.aadhar,
        medicals: user.medicals,
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

  const sos = await SoS.findOneAndUpdate(
    {
      trip: tripid,
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

exports.addContact = async (req, res) => {
  const userId = req.params.uid;

  const password = Math.floor(10000 + Math.random() * 90000);

  const { name, email, phone } = req.body;

  const contact = new Contact({
    name,
    email,
    phone,
    password,
    dependent: userId,
  });

  await contact.save();

  res.status(201).send({
    message: "Contact created",
    data: contact,
  });
};

exports.getAllContacts = async (req, res) => {
  const userId = req.params.uid;

  const contacts = await Contact.find({
    dependent: userId,
  });

  if (!contacts) {
    res.status(404).send({
      message: "No contacts found",
    });
    return;
  }

  res.status(200).send({
    message: "Success",
    data: contacts,
  });
};

exports.removeContacts = async (req, res) => {
  const contactId = req.params.cid;

  const deleteContact = await Contact.deleteOne({
    _id: contactId,
  });

  res.status(200).send({
    message: "Contact Deleted",
  });
};

exports.medicalSurvey = async (req, res) => {
  const userId = req.params.uid;

  const { medicals } = req.body;

  const updateMedical = await User.updateOne(
    {
      _id: userId,
    },
    { medicals },
    {
      new: true,
    }
  );

  if (!updateMedical) {
    res.status(400).send({
      message: "Update Failed",
    });
    return;
  }

  res.status(200).send({
    message: "Update Success",
    data: updateMedical.medicals,
  });
};

exports.panicAlert = async (req, res) => {
  const userId = req.params.uid;

  const { location } = req.body;

  const tripid = await Trip.findOne({
    userId,
    status: true,
  });

  if (!tripid) {
    // const sos = new SoS({
    //   location,
    //   userId,
    //   from: "self",
    // });
    // await sos.save();

    res.status(400).send({
      message: "SOS not Sent",
    });
    return;
  }

  const sos = new SoS({
    trip: tripid._id,
    location,
    userId,
    from: "self",
  });
  await sos.save();

  res.status(200).send({
    message: "SOS Sent",
  });
};

exports.updateLocation = async (req, res) => {
  const uid = req.params.uid;
  const tid = req.params.tid;

  const { location } = req.body;

  const exist = await LiveSchema.findOne({
    trip: tid,
  });

  if (exist) {
    const update = await LiveSchema.updateOne(
      {
        trip: tid,
      },
      { location },
      { new: true }
    );

    res.status(200).send({
      message: "Location Updated",
    });
    return;
  }

  const livelocation = new LiveSchema({
    userId: uid,
    trip: tid,
    location,
  });

  await livelocation.save();

  res.status(200).send({
    message: "Location Updated",
  });
};

//Image

exports.uploadPhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
};
