const path = require("path");

const express = require("express");
const nocache = require("nocache");
const mongoConnect = require("./utils/database").mongoConnect;
require("dotenv").config();
const app = express();

// routes
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(nocache());
// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// route middlewares
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

mongoConnect(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Running on PORT: ${process.env.PORT}`);
  });
});
