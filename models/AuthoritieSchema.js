const mongoose = require("mongoose");

const AuthoritieSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Authoritie", AuthoritieSchema);
