const router = require("express").Router();

const shopControllers = require("../controllers/shopControllers");

router.get("/", shopControllers.getHome);
router.get("/product/:id", shopControllers.getProduct);
router.get("/category/:category", shopControllers.getProductsByCategory);
router.get("/search", shopControllers.getProductsBySearch);
router.get("/cart", shopControllers.getCart);
router.get("/wishlist", shopControllers.getWishlist);

router.get("/account", shopControllers.getAccount);
router.get("/addresses", shopControllers.getAddresses);
router.get("/add-address", shopControllers.getAddAddress);
router.get("/orders", shopControllers.getOrders);

router.get("/login", shopControllers.getLogin);
router.get("/otp-login", shopControllers.getOtpLogin);
router.post("/verify-phone", shopControllers.postVerifyPhone);
router.get("/signup", shopControllers.getSignup);
router.get("/reset-password", shopControllers.getResetPassword);

router.get("*", (req, res) => {
  res.status(404).render("shop/404");
});

module.exports = router;
