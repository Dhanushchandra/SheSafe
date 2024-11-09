const route = require("express").Router();

const {
  userSignup,
  userLogin,
  startTrip,
  getTrips,
  cancelTrips,
  addContact,
  getAllContacts,
  removeContacts,
  medicalSurvey,
  panicAlert,
} = require("../controller/userController");

const {
  checkUserDuplicateEmail,
  checkContactDuplicateEmail,
} = require("../utils/middlewares/uniqueEmail");

const { verifyToken } = require("../utils/middlewares/tokenVerification");
const { verifyUser } = require("../utils/middlewares/userVerfication");

route.post("/signup", checkUserDuplicateEmail, userSignup);
route.post("/login", userLogin);
route.post("/starttrip/:uid", [verifyToken, verifyUser], startTrip);
route.get("/gettrip/:uid", [verifyToken, verifyUser], getTrips);
route.put("/updatetrip/:tid", verifyToken, cancelTrips);
route.post(
  "/addcontact/:uid",
  [verifyToken, verifyUser, checkContactDuplicateEmail],
  addContact
);
route.get("/addcontact/:uid", [verifyToken, verifyUser], getAllContacts);
route.delete("/removecontact/:cid", verifyToken, removeContacts);
route.put("/updatemedicals/:uid", [verifyToken, verifyUser], medicalSurvey);
route.post("/panic/:uid", [verifyToken, verifyUser], panicAlert);

module.exports = route;
