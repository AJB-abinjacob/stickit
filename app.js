const path = require("path");

const express = require("express");
const nocache = require("nocache");
require("dotenv").config();
const app = express();

const adminRoutes = require("./routes/adminRoutes.js");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(nocache());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/admin", adminRoutes);
app.use("/", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Running on PORT:3001");
});
