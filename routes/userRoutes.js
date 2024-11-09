const route = require("express").Router();

const { userSignup } = require("../controller/userController");

route.post("/signup", userSignup);

module.exports = route;
