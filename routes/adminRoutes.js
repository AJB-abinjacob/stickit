const router = require("express").Router();
const { upload } = require("../utils/multer");

const adminControllers = require("../controllers/adminControllers");

router.get("/", adminControllers.getDashboard);
router.get("/login", adminControllers.getLogin);
router.post("/login", adminControllers.postLogin);
router.post("/logout", adminControllers.postLogout);

router.get("/products", adminControllers.getProducts);
router.post(
  "/add-product",
  upload.array("productImages", 4),
  adminControllers.postAddProduct
);
router.post(
  "/edit-product",
  upload.array("productImages", 4),
  adminControllers.postEditProduct
);
router.post("/delete-product", adminControllers.postDeleteProduct);

router.get("/categories", adminControllers.getCategories);
router.post("/add-category", adminControllers.postAddCategory);
router.post("/edit-category", adminControllers.postEditCategory);
router.post("/delete-category", adminControllers.postDeleteCategory);

router.get("/orders", adminControllers.getOrders);

router.get("/coupons", adminControllers.getCoupons);
router.post("/add-coupon", adminControllers.postAddCoupon);
router.post("/edit-coupon", adminControllers.postEditCoupon);
router.post("/delete-coupon", adminControllers.postDeleteCoupon);

router.get("/banners", adminControllers.getBanners);
router.post(
  "/add-banner",
  upload.single("bannerImage"),
  adminControllers.postAddBanner
);
router.post(
  "/edit-banner",
  upload.single("bannerImage"),
  adminControllers.postEditBanner
);
router.post("/delete-banner", adminControllers.postDeleteBanner);

router.get("/customers", adminControllers.getCustomers);
router.get("/invoice/:orderId", adminControllers.getInvoice);

module.exports = router;
