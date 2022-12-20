const bcrypt = require('bcrypt')

const { ObjectId } = require('mongodb')
const Customer = require('../models/customerModel')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')

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
    // add session here
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
}

exports.getOtpLogin = async (req, res) => {
  try {
    res.render('shop/logins/otp-login')
  } catch (err) {
    console.log(err)
  }
}

exports.postVerifyPhone = async (req, res) => {
  try {
    const { phone } = req.body
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

exports.postSignup = async (req, res) => {
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
    res.redirect('/login')
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
    const userId = '63986df5de30499b024a4c94'
    const categories = await Category.fetchAll()
    const wishlistArray = await Customer.fetchWishlist(userId)
    const wishlist = wishlistArray[0].wishlist
    const recentlyAddedProducts = await Product.fetchAll(0, 4)
    recentlyAddedProducts.forEach((product) => {
      wishlist.forEach((wishlistItem) => {
        if (product._id.toString() === wishlistItem.toString()) {
          product.isWishlisted = true
        }
      })
    })
    res.render('shop/home', {
      products: recentlyAddedProducts,
      categories
    })
  } catch (err) {
    console.log(err)
  }
}
exports.getProduct = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    const product = await Product.fetchById(req.params.id)
    console.log(product)
    res.render('shop/product', { product, categories })
  } catch (err) {
    console.log(err)
  }
}
exports.getProductsByCategory = async (req, res) => {
  try {
    const userId = '63986df5de30499b024a4c94'
    const categories = await Category.fetchAll()
    const { category } = req.params
    let categoryExist
    let products = []
    categories.forEach((item) => {
      if (item.categoryName === category) {
        categoryExist = item
      }
    })
    if (categoryExist) {
      products = await Product.fetchByCategory(categoryExist._id)
      const wishlistArray = await Customer.fetchWishlist(userId)
      const wishlist = wishlistArray[0].wishlist
      products.forEach(product => {
        wishlist.forEach((wishlistItem) => {
          if (product._id.toString() === wishlistItem.toString()) {
            product.isWishlisted = true
          }
        })
      })
      return res.render('shop/show-products', {
        category,
        categories,
        products
      })
    }
    res.render('shop/show-products', {
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
    const query = req.query.search
    const categories = await Category.fetchAll()
    const products = await Product.fetchByValue(query)
    console.log(products.length)
    res.render('shop/show-products', { category, query, categories, products })
  } catch (err) {
    console.log(err)
  }
}

exports.getWishlist = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('shop/wishlist', { categories })
  } catch (err) {
    console.log(err)
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const userId = '63986df5de30499b024a4c94'
    const productId = req.params.id
    await Customer.addToWishlist(userId, ObjectId(productId))
    res.json('added to wishlist')
  } catch (err) {
    console.log(err)
  }
}
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = '63986df5de30499b024a4c94'
    const productId = req.params.id
    await Customer.removeFromWishlist(userId, ObjectId(productId))
    res.json('removed from wishlist')
  } catch (err) {
    console.log(err)
  }
}

exports.getCart = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('shop/cart', { categories })
  } catch (err) {
    console.log(err)
  }
}

exports.addToCart = async (req, res) => {
  try {
    const userId = '63986df5de30499b024a4c94'
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
    // const userId = '63986df5de30499b024a4c94'
    const product = { productId: ObjectId(req.params.id) }
    console.log(product)
    res.json('removed-from-cart')
  } catch (err) {
    console.log(err)
  }
}

exports.getAccount = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('shop/account', { path: '/account', categories })
  } catch (err) {
    console.log(err)
  }
}
exports.getAddresses = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('shop/account', { path: '/addresses', categories })
  } catch (err) {
    console.log(err)
  }
}
exports.getAddAddress = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('shop/account', { path: '/add-address', categories })
  } catch (err) {
    console.log(err)
  }
}
exports.getOrders = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('shop/account', { path: '/orders', categories })
  } catch (err) {
    console.log(err)
  }
}
