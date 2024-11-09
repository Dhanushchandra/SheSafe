const User = require("../../models/UserSchema");
const Contact = require("../../models/ContactSchema");

exports.checkUserDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (user) {
      res.status(400).send({
        data: { error: "Failed! Email is already in use!", isExist: true },
      });
      return;
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.checkContactDuplicateEmail = async (req, res, next) => {
  try {
    const user = await Contact.findOne({ email: req.body.email.toLowerCase() });

    if (user) {
      res.status(400).send({
        data: { error: "Failed! Email is already in use!", isExist: true },
      });
      return;
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
