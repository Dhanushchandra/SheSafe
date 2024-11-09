const route = require("express").Router();

const multer = require("multer");
const path = require("path");

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
  updateLocation,
  uploadPhoto,
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
route.post("/live/:uid/:tid", [verifyToken, verifyUser], updateLocation);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { uid } = req.params;
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uid}_${timestamp}${fileExtension}`);
  },
});

const upload = multer({ storage });

route.post(
  "/upload/:uid/",
  [verifyToken, upload.single("photo")],
  updateLocation
);

module.exports = route;
