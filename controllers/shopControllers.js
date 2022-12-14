const bcrypt = require('bcrypt')

const Customer = require('../models/customerModel')

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
    res.render('shop/home')
  } catch (err) {
    console.log(err)
  }
}
exports.getProduct = async (req, res) => {
  try {
    console.log(req.params.id)
    res.render('shop/product')
  } catch (err) {
    console.log(err)
  }
}
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    res.render('shop/show-products', { category })
  } catch (err) {
    console.log(err)
  }
}
exports.getProductsBySearch = async (req, res) => {
  try {
    let category // need undefined value
    const query = req.query.search
    console.log(query)
    res.render('shop/show-products', { category, query })
  } catch (err) {
    console.log(err)
  }
}

exports.getWishlist = async (req, res) => {
  try {
    res.render('shop/wishlist')
  } catch (err) {
    console.log(err)
  }
}

exports.getCart = async (req, res) => {
  try {
    res.render('shop/cart')
  } catch (err) {
    console.log(err)
  }
}

exports.getAccount = async (req, res) => {
  try {
    res.render('shop/account', { path: '/account' })
  } catch (err) {
    console.log(err)
  }
}
exports.getAddresses = async (req, res) => {
  try {
    res.render('shop/account', { path: '/addresses' })
  } catch (err) {
    console.log(err)
  }
}
exports.getAddAddress = async (req, res) => {
  try {
    res.render('shop/account', { path: '/add-address' })
  } catch (err) {
    console.log(err)
  }
}
exports.getOrders = async (req, res) => {
  try {
    res.render('shop/account', { path: '/orders' })
  } catch (err) {
    console.log(err)
  }
}
