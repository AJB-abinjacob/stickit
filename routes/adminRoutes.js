const router = require("express").Router();

const adminControllers = require("../controllers/adminControllers");

router.get("/", adminControllers.getHome);

module.exports = router;
