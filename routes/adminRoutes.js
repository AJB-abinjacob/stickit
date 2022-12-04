const router = require("express").Router();

const adminControllers = require("../controllers/adminControllers");

router.get("/", adminControllers.getHome);
router.get("/login", adminControllers.getLogin);
router.post("/login", adminControllers.postLogin);
router.post("/logout", adminControllers.postLogout);

router.get("/products", adminControllers.getProducts);
router.get("/categories", adminControllers.getCategories);
router.get("/orders", adminControllers.getOrders);
router.get("/coupons", adminControllers.getCoupons);
router.get("/banners", adminControllers.getBanners);
router.get("/customers", adminControllers.getCustomers);

router.get("/invoice/:orderId", adminControllers.getInvoice);

module.exports = router;
