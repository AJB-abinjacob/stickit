const router = require("express").Router();
const { upload } = require("../utils/multer");

const adminControllers = require("../controllers/adminControllers");

router.get("/", adminControllers.getHome);
router.get("/login", adminControllers.getLogin);
router.post("/login", adminControllers.postLogin);
router.post("/logout", adminControllers.postLogout);

router.get("/products", adminControllers.getProducts);
router.post(
  "/add-product",
  upload.array("productImages", 4),
  adminControllers.postAddProduct
);

router.get("/categories", adminControllers.getCategories);
router.post("/add-category", adminControllers.postAddCategory);

router.get("/orders", adminControllers.getOrders);
router.get("/coupons", adminControllers.getCoupons);
router.post("/add-coupon", adminControllers.postAddCoupon);

router.get("/banners", adminControllers.getBanners);
router.post(
  "/add-banner",
  upload.single("bannerImage"),
  adminControllers.postAddBanner
);

router.get("/customers", adminControllers.getCustomers);
router.get("/invoice/:orderId", adminControllers.getInvoice);

module.exports = router;
