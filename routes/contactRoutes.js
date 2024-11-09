const route = require("express").Router();

const {
  login,
  getDependent,
  getDependentTrip,
  triggerSos,
  getLiveLocation,
  getSosPhotos,
} = require("../controller/contactController");

const { verifyToken } = require("../utils/middlewares/tokenVerification");
const { verifyContact } = require("../utils/middlewares/userVerfication");

route.post("/login", login);
route.get("/getdependent/:cid", [verifyToken, verifyContact], getDependent);
route.get("/getdependenttrip/:uid", verifyToken, getDependentTrip);
route.post("/triggersos/:tid", verifyToken, triggerSos);
route.get("/livelocation/:tid", verifyToken, getLiveLocation);
route.get("/getphoto/:uid", verifyToken, getSosPhotos);

module.exports = route;
