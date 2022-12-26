const router = require('express').Router()

const shopControllers = require('../controllers/shopControllers')

router.get('/', shopControllers.getHome)
router.get('/shop', shopControllers.getShop)
router.get('/product/:id', shopControllers.getProduct)
router.get('/category/:category', shopControllers.getProductsByCategory)
router.get('/search', shopControllers.getProductsBySearch)

router.get('/cart', shopControllers.getCart)
router.post('/add-to-cart/:id', shopControllers.addToCart)
router.post('/remove-from-cart/:id', shopControllers.removeFromCart)
router.post('/decrement-quantity/:id', shopControllers.decrementQuantity)

router.get('/wishlist', shopControllers.getWishlist)
router.post('/add-to-wishlist/:id', shopControllers.addToWishlist)
router.post('/remove-from-wishlist/:id', shopControllers.removeFromWishlist)

router.get('/account', shopControllers.getAccount)
router.post('/update-user', shopControllers.postUpdateUser)
router.get('/addresses', shopControllers.getAddresses)
router.get('/add-address', shopControllers.getAddAddress)
router.post('/add-address', shopControllers.postAddAddress)

router.get('/orders', shopControllers.getOrders)
router.post('/checkout', shopControllers.postCheckout)

router.post('/create-order', shopControllers.postCreateOrder)
router.post('/verify-payment-razorpay', shopControllers.postRzpVerifyPayment)
router.get(
  '/order-placed-successfully',
  shopControllers.getOrderPlacedSuccessfully
)
router.post('/cancel-order/:id', shopControllers.postCancelOrder)

router.get('/login', shopControllers.getLogin)
router.post('/login', shopControllers.postLogin)
router.get('/otp-login', shopControllers.getOtpLogin)
router.post('/verify-phone', shopControllers.postVerifyPhone)
router.get('/signup', shopControllers.getSignup)
router.post('/signup', shopControllers.postSignup)
router.get('/reset-password', shopControllers.getResetPassword)

router.get('*', shopControllers.get404)

module.exports = router
