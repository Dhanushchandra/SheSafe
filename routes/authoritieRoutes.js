const route = require("express").Router();

const {
  login,
  sosList,
  updateSos,
} = require("../controller/authoritieController");

const { verifyToken } = require("../utils/middlewares/tokenVerification");

route.post("/login", login);
route.get("/sos", verifyToken, sosList);
route.put("/deactivatesos/:sid", verifyToken, updateSos);

module.exports = route;
