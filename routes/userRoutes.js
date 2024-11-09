const route = require("express").Router();

const {
  userSignup,
  userLogin,
  startTrip,
  getTrips,
  cancelTrips,
} = require("../controller/userController");

const { checkUserDuplicateEmail } = require("../utils/middlewares/uniqueEmail");

route.post("/signup", checkUserDuplicateEmail, userSignup);
route.post("/login", userLogin);
route.post("/starttrip/:uid", startTrip);
route.get("/gettrip/:uid", getTrips);
route.put("/updatetrip/:tid", cancelTrips);

module.exports = route;
