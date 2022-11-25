const router = require("express").Router();

const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.getHome);

module.exports = router;
