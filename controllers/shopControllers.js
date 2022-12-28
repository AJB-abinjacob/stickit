/* eslint-disable array-callback-return */
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

const Customer = require('../models/customerModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')

const razorpay = require('../utils/razorpay')
const msg = require('../utils/msg91')

const ITEMS_PER_PAGE = 10

const generateOTP = (length = 4) => {
  // Declare a digits variable
  // which stores all digits
  const digits = '0123456789'
  let OTP = ''
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }
  return OTP
}

exports.getLogin = async (req, res) => {
  try {
    res.render('shop/logins/login', { message: req.flash('message') })
  } catch (err) {
    console.log(err)
  }
}

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const customer = await Customer.findByEmail(email)
    if (!customer) {
      req.flash('message', "User doesn't exist")
      return res.redirect('/login')
    }
    const passwordMatch = await bcrypt.compare(password, customer.password)
    if (!passwordMatch) {
      req.flash('message', 'Wrong password')
      return res.redirect('/login')
    }
    req.session.userId = customer._id.toString()
    req.session.save((err) => {
      if (err) {
        console.log(err)
      }
      res.redirect('/')
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postLogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
}

exports.getOtpLogin = async (req, res) => {
  try {
    res.render('shop/logins/otp-login', { message: req.flash('message') })
  } catch (err) {
    console.log(err)
  }
}

exports.postVerifyOTPLogin = async (req, res) => {
  try {
    const { phone } = req.body
    const customer = await Customer.findByPhone(phone)
    if (!customer) {
      req.flash('message', 'No user found')
      return res.redirect('/otp-login')
    }
    const smsOptions = {
      phone,
      otp: generateOTP()
    }
    await msg.sendOTP(smsOptions)
    res.render('shop/logins/verify-otp', { phone })
  } catch (err) {
    console.log(err)
  }
}

exports.getSignup = async (req, res) => {
  try {
    res.render('shop/logins/signup', { message: req.flash('message') })
  } catch (err) {
    console.log(err)
  }
}

exports.postVerifyPhone = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    const emailRegex =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,16}$/
    if (!name.match(nameRegex)) {
      req.flash('message', 'Please enter a name')
      return res.redirect('/signup')
    }
    if (!email.toLowerCase().match(emailRegex)) {
      req.flash('message', 'Please enter a valid email id')
      return res.redirect('/signup')
    }
    if (phone.trim().length !== 10 || !/^[0-9]+$/.test(phone)) {
      req.flash('message', 'Please enter a valid phone number')
      return res.redirect('/signup')
    }
    if (password !== confirmPassword) {
      req.flash('message', 'Password Mismatch')
      return res.redirect('/signup')
    }
    if (password.match(passwordRegex)) {
      req.flash('message', 'Please enter a valid password')
      return res.redirect('/signup')
    }

    const existingEmail = await Customer.findByEmail(email)
    if (existingEmail) {
      req.flash('message', 'A user with the same email id already exist!')
      return res.redirect('/signup')
    }
    const existingPhone = await Customer.findByPhone(phone)
    if (existingPhone) {
      req.flash('message', 'A user with the same phone number already exist!')
      return res.redirect('/signup')
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new Customer(name, email, phone, hashedPassword)
    await user.save()
    const smsOptions = {
      phone,
      otp: generateOTP()
    }
    await msg.sendOTP(smsOptions)
    res.render('shop/logins/verify-otp', { phone })
  } catch (err) {
    console.log(err)
  }
}

exports.postVerifyOTP = async (req, res) => {
  try {
    const { otp, phone } = req.body
    const customer = await Customer.findByPhone(phone)
    const smsOptions = {
      phone,
      otp
    }
    if (!customer) {
      req.flash('message', 'User doesn\'t exist. Please signup.')
      return res.redirect('/signup')
    }
    const response = await msg.verifyOTP(smsOptions)
    if (!response) {
      req.flash('message', 'OTP mismatch. Please try again.')
      // await Customer.deleteOne(customer._id)
      return res.redirect('/otp-login')
    }
    req.session.userId = customer._id.toString()
    req.session.save((err) => {
      if (err) {
        console.log(err)
      }
      res.redirect('/')
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getResetPassword = async (req, res) => {
  try {
    res.render('shop/logins/reset-password')
  } catch (err) {
    console.log(err)
  }
}

exports.getHome = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    const wishlistArray = await Customer.fetchWishlist(userId)
    const recentlyAddedProducts = await Product.fetchAll(0, 4)
    if (wishlistArray && wishlistArray.length > 0) {
      const wishlist = wishlistArray[0].wishlist
      recentlyAddedProducts.forEach((product) => {
        wishlist.forEach((wishlistItem) => {
          if (product._id.toString() === wishlistItem.toString()) {
            product.isWishlisted = true
          }
        })
      })
    }
    res.render('shop/home', {
      products: recentlyAddedProducts,
      categories,
      userId
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getShop = async (req, res) => {
  try {
    const userId = req.session.userId
    const category = 'SHOP'
    const { page } = req.query
    const skip = (page - 1) * ITEMS_PER_PAGE || 0
    const limit = ITEMS_PER_PAGE
    const totalProducts = await Product.count()
    const categories = await Category.fetchAll()
    const wishlistArray = await Customer.fetchWishlist(userId)
    const products = await Product.fetchAll(skip, limit)
    if (wishlistArray && wishlistArray.length > 0) {
      const wishlist = wishlistArray[0].wishlist
      products.forEach((product) => {
        wishlist.forEach((wishlistItem) => {
          if (product._id.toString() === wishlistItem.toString()) {
            product.isWishlisted = true
          }
        })
      })
    }
    res.render('shop/show-products', {
      category,
      userId,
      categories,
      products,
      totalProducts,
      skip,
      limit,
      page,
      currentPage: page,
      lastPage: Math.ceil(totalProducts / limit)
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getProduct = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    const product = await Product.fetchById(req.params.id)
    const wishlistArray = await Customer.fetchWishlist(userId)
    if (wishlistArray && wishlistArray.length > 0) {
      const wishlist = wishlistArray[0].wishlist
      wishlist.forEach((wishlistItem) => {
        if (product._id.toString() === wishlistItem.toString()) {
          product.isWishlisted = true
        }
      })
    }
    res.render('shop/product', { userId, product, categories })
  } catch (err) {
    console.log(err)
  }
}
exports.getProductsByCategory = async (req, res) => {
  try {
    let query // need undefined value
    const userId = req.session.userId
    const { category } = req.params
    const { page } = req.query
    const skip = (page - 1) * ITEMS_PER_PAGE || 0
    const limit = ITEMS_PER_PAGE
    const categories = await Category.fetchAll()
    let categoryExist
    let products = []
    categories.forEach((item) => {
      if (item.categoryName === category) {
        categoryExist = item
      }
    })
    if (categoryExist) {
      const totalProducts = await Product.countByCategoryId(categoryExist._id)
      products = await Product.fetchByCategory(categoryExist._id, skip, limit)
      const wishlistArray = await Customer.fetchWishlist(userId)
      if (wishlistArray && wishlistArray.length > 0) {
        const wishlist = wishlistArray[0].wishlist
        products.forEach((product) => {
          wishlist.forEach((wishlistItem) => {
            if (product._id.toString() === wishlistItem.toString()) {
              product.isWishlisted = true
            }
          })
        })
      }
      return res.render('shop/show-products', {
        userId,
        category,
        query,
        categories,
        products,
        totalProducts,
        skip,
        limit,
        page,
        currentPage: page,
        lastPage: Math.ceil(totalProducts / limit)
      })
    }
    res.render('shop/show-products', {
      userId,
      category,
      categories,
      products
    })
  } catch (err) {
    console.log(err)
  }
}
exports.getProductsBySearch = async (req, res) => {
  try {
    let category // need undefined value
    const userId = req.session.userId
    const query = req.query.search
    const { page } = req.query
    const skip = (page - 1) * ITEMS_PER_PAGE || 0
    const limit = ITEMS_PER_PAGE
    const totalProducts = await Product.countByValue(query)
    const categories = await Category.fetchAll()
    const products = await Product.fetchByValue(query, skip, limit)
    const wishlistArray = await Customer.fetchWishlist(userId)
    if (wishlistArray && wishlistArray.length > 0) {
      const wishlist = wishlistArray[0].wishlist
      products.forEach((product) => {
        wishlist.forEach((wishlistItem) => {
          if (product._id.toString() === wishlistItem.toString()) {
            product.isWishlisted = true
          }
        })
      })
    }

    res.render('shop/show-products', {
      userId,
      category,
      query,
      categories,
      products,
      totalProducts,
      skip,
      limit,
      page,
      currentPage: page,
      lastPage: Math.ceil(totalProducts / limit)
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    const wishlist = await Customer.fetchWishlistItems(userId)
    const products = wishlist[0].products
    res.render('shop/wishlist', { userId, categories, products })
  } catch (err) {
    console.log(err)
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.session.userId
    const productId = req.params.id
    await Customer.addToWishlist(userId, ObjectId(productId))
    res.json('added to wishlist')
  } catch (err) {
    console.log(err)
  }
}
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.session.userId
    const productId = req.params.id
    await Customer.removeFromWishlist(userId, ObjectId(productId))
    res.json('removed from wishlist')
  } catch (err) {
    console.log(err)
  }
}

exports.getCart = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    const cartArray = await Customer.fetchCartItems(userId)
    cartArray[0].products.forEach((product) => {
      cartArray[0].cart.forEach((cartItem) => {
        if (product._id.toString() === cartItem.productId.toString()) {
          product.quantity = cartItem.quantity
        }
      })
    })
    const products = cartArray[0].products
    res.render('shop/cart', { userId, categories, products })
  } catch (err) {
    console.log(err)
  }
}

exports.postAddToCart = async (req, res) => {
  try {
    const userId = req.session.userId
    const product = {
      productId: ObjectId(req.params.id),
      quantity: parseInt(req.body.quantity)
    }
    await Customer.addToCart(userId, product)
    res.json('added-to-cart')
  } catch (err) {
    console.log(err)
  }
}
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.userId
    const { id } = req.params
    await Customer.removeFromCart(userId, id)
    res.redirect('/cart')
  } catch (err) {
    console.log(err)
  }
}

exports.decrementQuantity = async (req, res) => {
  try {
    const userId = req.session.userId
    const { id } = req.params
    await Customer.decrementQuantity(userId, id)
    res.json('quantity-decremented')
  } catch (err) {
    console.log(err)
  }
}

exports.postCheckout = async (req, res) => {
  try {
    const { instructions } = req.body
    const userId = req.session.userId
    const randomNum = Math.floor(Math.random() * 100000000)
    const categories = await Category.fetchAll()
    const user = await Customer.findById(userId)
    const addressArray = await Customer.fetchAdresses(userId)
    const cartArray = await Customer.fetchCartItems(userId)
    const couponsArray = await Coupon.fetchActive()
    const coupons = couponsArray.filter((coupon) => {
      const date = new Date()
      if (date <= new Date(coupon.expiresOn)) {
        return coupon
      }
    })
    const addresses = addressArray[0].addresses || []
    cartArray[0].products.forEach((product) => {
      cartArray[0].cart.forEach((cartItem) => {
        if (product._id.toString() === cartItem.productId.toString()) {
          product.quantity = cartItem.quantity
        }
      })
    })
    const products = cartArray[0].products
    res.render('shop/checkout', {
      userId,
      categories,
      user: user[0],
      randomNum,
      products,
      addresses,
      coupons,
      instructions
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postCreateOrder = async (req, res) => {
  try {
    const userId = req.session.userId
    const { paymentMethod, amount, address, specialInstruction, couponCode } =
      req.body
    let coupon
    const instructions = specialInstruction || ''
    if (couponCode) {
      coupon = await Coupon.fetchByCouponCode(couponCode)
    }
    const fetchedCart = await Customer.fetchCartItems(userId)

    fetchedCart[0].cart.forEach((item) => {
      fetchedCart[0].products.forEach((product) => {
        if (item.productId.toString() === product._id.toString()) {
          item.price =
            parseInt(product.productPrice) -
            parseInt(product.discount === '' ? 0 : product.discount)
        }
      })
    })
    const items = fetchedCart[0].cart
    const payment = {
      amountPayable: amount,
      paymentMethod,
      status: 'pending',
      shippingCharge: 'free',
      discount: coupon?.amount || 0
    }
    const order = new Order(userId, items, instructions, address, payment)
    await order.save()
    if (paymentMethod === 'razorpay') {
      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: 'INR'
      })
      res.json({ order, address, amount, paymentMethod })
    } else if (paymentMethod === 'cod') {
      console.log('cod')
      await Customer.clearCart(userId)
      res.json({ order: 'success', paymentMethod: 'cod' })
    } else if (paymentMethod === 'paypal') {
      await Customer.clearCart(userId)
      res.json({ order: 'success', paymentMethod: 'paypal' })
    }
  } catch (err) {
    console.log(err)
  }
}

exports.postRzpVerifyPayment = async (req, res) => {
  try {
    const userId = req.session.userId
    const rzpPaymentId = req.body.razorpay_payment_id
    if (rzpPaymentId) {
      await Customer.clearCart(userId)
    }
    res.redirect('/order-placed-successfully')
  } catch (err) {
    console.log(err)
  }
}

exports.getOrderPlacedSuccessfully = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    res.render('shop/order-placed', { userId, categories })
  } catch (err) {
    console.log(err)
  }
}

exports.getAccount = async (req, res) => {
  try {
    const userId = req.session.userId
    const user = await Customer.findById(userId)
    const categories = await Category.fetchAll()
    res.render('shop/account', {
      userId,
      path: '/account',
      categories,
      user: user[0],
      message: req.flash('message')
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postUpdateUser = async (req, res) => {
  try {
    if (req.body.name) {
      const { id } = req.body
      const userData = {
        name: req.body.name
      }
      await Customer.update(id, userData)
      req.flash('message', 'Profile updated successfully')
      return res.redirect('/account')
    }
    const { currentPassword, newPassword, confirmNewPassword, id } = req.body
    const user = await Customer.findByIdForPassword(id)
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user[0].password
    )
    if (newPassword !== confirmNewPassword) {
      req.flash('message', 'New passwords does not match')
      return res.redirect('/account')
    }
    if (passwordMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      await Customer.update(id, { password: hashedPassword })
      req.flash('message', 'Password changed successfully')
      return res.redirect('/account')
    }
    req.flash('message', 'Current password does not match')
    res.redirect('/account')
  } catch (err) {
    console.log(err)
  }
}

exports.getAddresses = async (req, res) => {
  try {
    const userId = req.session.userId
    const addressArray = await Customer.fetchAdresses(userId)
    const addresses = addressArray[0].addresses || []
    const categories = await Category.fetchAll()
    res.render('shop/account', {
      userId,
      path: '/addresses',
      categories,
      addresses
    })
  } catch (err) {
    console.log(err)
  }
}
exports.getAddAddress = async (req, res) => {
  try {
    const userId = req.session.userId
    const randomNum = Math.floor(Math.random() * 100000000)
    const categories = await Category.fetchAll()
    res.render('shop/account', {
      userId,
      path: '/add-address',
      categories,
      randomNum
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postAddAddress = async (req, res) => {
  try {
    const userId = req.session.userId
    const address = req.body
    address.id = new ObjectId()
    await Customer.addAddress(userId, address)
    console.log(address)
    console.log('address added')
    res.redirect('/addresses')
  } catch (err) {
    console.log(err)
  }
}
exports.getOrders = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    const orders = await Order.fetchByUser(userId)
    orders.forEach((order) => {
      order.items.forEach((item) => {
        order.products.forEach((product) => {
          if (product._id.toString() === item.productId.toString()) {
            product.quantity = item.quantity
          }
        })
      })
    })
    res.render('shop/account', { userId, path: '/orders', categories, orders })
  } catch (err) {
    console.log(err)
  }
}
exports.postCancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    await Order.update(orderId, { status: 'cancelled' })
    res.redirect('/orders')
  } catch (err) {
    console.log(err)
  }
}

exports.get404 = async (req, res) => {
  try {
    const userId = req.session.userId
    const categories = await Category.fetchAll()
    res.render('shop/404', { userId, categories })
  } catch (err) {
    console.log(err)
  }
}
