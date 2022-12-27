const router = require('express').Router()
const { upload } = require('../utils/multer')

const adminControllers = require('../controllers/adminControllers')
const adminAuth = require('../auth/adminAuth')

router.get('/', adminAuth.isLoggedIn, adminControllers.getDashboard)
router.get('/login', adminAuth.isLoggedOut, adminControllers.getLogin)
router.post('/login', adminAuth.isLoggedOut, adminControllers.postLogin)
router.post('/logout', adminAuth.isLoggedIn, adminControllers.postLogout)

router.get('/products', adminAuth.isLoggedIn, adminControllers.getProducts)
router.post(
  '/add-product',
  adminAuth.isLoggedIn,
  upload.array('productImages', 4),
  adminControllers.postAddProduct
)
router.post(
  '/edit-product',
  adminAuth.isLoggedIn,
  upload.array('productImages', 4),
  adminControllers.postEditProduct
)
router.post(
  '/delete-product',
  adminAuth.isLoggedIn,
  adminControllers.postDeleteProduct
)

router.get('/categories', adminAuth.isLoggedIn, adminControllers.getCategories)
router.post(
  '/add-category',
  adminAuth.isLoggedIn,
  adminControllers.postAddCategory
)
router.post(
  '/edit-category',
  adminAuth.isLoggedIn,
  adminControllers.postEditCategory
)
router.post(
  '/delete-category',
  adminAuth.isLoggedIn,
  adminControllers.postDeleteCategory
)

router.get('/orders', adminAuth.isLoggedIn, adminControllers.getOrders)
router.post(
  '/update-order-status',
  adminAuth.isLoggedIn,
  adminControllers.postUpdateOrderStatus
)

router.get('/coupons', adminAuth.isLoggedIn, adminControllers.getCoupons)
router.post('/add-coupon', adminAuth.isLoggedIn, adminControllers.postAddCoupon)
router.post(
  '/edit-coupon',
  adminAuth.isLoggedIn,
  adminControllers.postEditCoupon
)
router.post(
  '/delete-coupon',
  adminAuth.isLoggedIn,
  adminControllers.postDeleteCoupon
)

router.get('/banners', adminAuth.isLoggedIn, adminControllers.getBanners)
router.post(
  '/add-banner',
  adminAuth.isLoggedIn,
  upload.single('bannerImage'),
  adminControllers.postAddBanner
)
router.post(
  '/edit-banner',
  adminAuth.isLoggedIn,
  upload.single('bannerImage'),
  adminControllers.postEditBanner
)
router.post(
  '/delete-banner',
  adminAuth.isLoggedIn,
  adminControllers.postDeleteBanner
)

router.get('/customers', adminAuth.isLoggedIn, adminControllers.getCustomers)
router.get(
  '/invoice/:orderId',
  adminAuth.isLoggedIn,
  adminControllers.getInvoice
)

module.exports = router
