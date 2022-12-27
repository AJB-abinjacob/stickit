const router = require('express').Router()

const shopControllers = require('../controllers/shopControllers')
const shopAuth = require('../auth/shopAuth')

router.get('/', shopControllers.getHome)
router.get('/shop', shopControllers.getShop)
router.get('/product/:id', shopControllers.getProduct)
router.get('/category/:category', shopControllers.getProductsByCategory)
router.get('/search', shopControllers.getProductsBySearch)

router.get('/cart', shopAuth.isLoggedIn, shopControllers.getCart)
router.post(
  '/add-to-cart/:id',
  shopAuth.isLoggedIn,
  shopControllers.postAddToCart
)
router.post(
  '/remove-from-cart/:id',
  shopAuth.isLoggedIn,
  shopControllers.removeFromCart
)
router.post(
  '/decrement-quantity/:id',
  shopAuth.isLoggedIn,
  shopControllers.decrementQuantity
)
router.get('/wishlist', shopAuth.isLoggedIn, shopControllers.getWishlist)
router.post(
  '/add-to-wishlist/:id',
  shopAuth.isLoggedIn,
  shopControllers.addToWishlist
)
router.post(
  '/remove-from-wishlist/:id',
  shopAuth.isLoggedIn,
  shopControllers.removeFromWishlist
)

router.get('/account', shopAuth.isLoggedIn, shopControllers.getAccount)
router.post('/update-user', shopAuth.isLoggedIn, shopControllers.postUpdateUser)
router.get('/addresses', shopAuth.isLoggedIn, shopControllers.getAddresses)
router.get('/add-address', shopAuth.isLoggedIn, shopControllers.getAddAddress)
router.post('/add-address', shopAuth.isLoggedIn, shopControllers.postAddAddress)

router.get('/orders', shopAuth.isLoggedIn, shopControllers.getOrders)
router.post('/checkout', shopAuth.isLoggedIn, shopControllers.postCheckout)

router.post(
  '/create-order',
  shopAuth.isLoggedIn,
  shopControllers.postCreateOrder
)
router.post(
  '/verify-payment-razorpay',
  shopAuth.isLoggedIn,
  shopControllers.postRzpVerifyPayment
)
router.get(
  '/order-placed-successfully',
  shopAuth.isLoggedIn,
  shopControllers.getOrderPlacedSuccessfully
)
router.post(
  '/cancel-order/:id',
  shopAuth.isLoggedIn,
  shopControllers.postCancelOrder
)

router.get('/login', shopAuth.isLoggedOut, shopControllers.getLogin)
router.post('/login', shopControllers.postLogin)
router.get('/otp-login', shopAuth.isLoggedOut, shopControllers.getOtpLogin)
router.post('/verify-phone', shopControllers.postVerifyPhone)
router.get('/signup', shopAuth.isLoggedOut, shopControllers.getSignup)
router.post('/signup', shopControllers.postSignup)
router.get(
  '/reset-password',
  shopAuth.isLoggedOut,
  shopControllers.getResetPassword
)
router.post('/logout', shopControllers.postLogout)

router.get('*', shopControllers.get404)

module.exports = router
