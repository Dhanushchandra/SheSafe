const User = require("../models/UserSchema");

exports.userSignup = async (req, res) => {
  const { username, email, password, phone, aadhar, medicals } = req.body;

  const user = await User({
    username,
    email,
    password,
    phone,
    aadhar,
    medicals,
  });

  await user.save();

  res.send({
    messege: "saved",
  });
};
