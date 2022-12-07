const router = require("express").Router();

const shopControllers = require("../controllers/shopControllers");

router.get("/", shopControllers.getDashboard);

router.get("/login", shopControllers.getLogin);
router.get("/otp-login", shopControllers.getOtpLogin);
router.post("/verify-phone", shopControllers.postVerifyPhone);
router.get("/signup", shopControllers.getSignup);
router.get("/reset-password", shopControllers.getResetPassword);

module.exports = router;
