require("dotenv").config();
const express = require("express");
const DBconnection = require("./config/DBconnection");
const app = express();
const bodyParser = require("body-parser");

const userRoute = require("./routes/userRoutes");
const contactRoute = require("./routes/contactRoutes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/contact", contactRoute);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

DBconnection();

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
});
