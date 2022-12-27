const { ObjectId } = require('mongodb')

const cloudinary = require('../utils/cloudinary')

const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const Coupon = require('../models/couponModel')
const Banner = require('../models/bannerModel')
const Order = require('../models/orderModel')

const ITEMS_PER_PAGE = 10

exports.getLogin = async (req, res) => {
  try {
    res.render('admin/login')
  } catch (err) {
    console.log(err)
  }
}
exports.postLogin = async (req, res) => {
  try {
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
  }
}

exports.postLogout = async (req, res) => {
  try {
    res.redirect('/admin/login')
  } catch (err) {
    console.log(err)
  }
}

exports.getDashboard = async (req, res) => {
  try {
    res.render('admin/dashboard', { path: '/' })
  } catch (err) {
    console.log(err)
  }
}
exports.getProducts = async (req, res) => {
  try {
    const { page } = req.query
    const skip = (page - 1) * ITEMS_PER_PAGE || 0
    const limit = ITEMS_PER_PAGE
    const totalProducts = await Product.count()
    const categories = await Category.fetchAll()
    const products = await Product.fetchAll(skip, limit)
    res.render('admin/products', {
      path: '/products',
      categories,
      products,
      totalProducts,
      skip,
      limit,
      page,
      currentPage: page,
      lastPage: Math.ceil(totalProducts / limit)
    })
  } catch (error) {
    console.log(error)
  }
}

exports.postAddProduct = async (req, res) => {
  try {
    const { productTitle, productCategory, productPrice, discount, stock } =
      req.body
    const imgPromises = req.files.map((image) =>
      cloudinary.uploader.upload(image.path, {
        folder: 'product_images',
        unique_filename: true
      })
    )
    const results = await Promise.allSettled(imgPromises)
    const imgUrls = results.map((result) => result.value.secure_url)
    const newProduct = new Product(
      productTitle,
      productCategory,
      productPrice,
      discount,
      stock,
      imgUrls
    )
    await newProduct.save()
    console.log('Product Added')
    res.redirect('/admin/products')
  } catch (err) {
    console.log(err)
  }
}

exports.postEditProduct = async (req, res) => {
  try {
    const { id } = req.body
    const updatedProduct = {
      productTitle: req.body.productTitle,
      category: ObjectId(req.body.productCategory),
      productPrice: req.body.productPrice,
      discount: req.body.discount,
      stock: req.body.stock,
      updatedOn: new Date()
    }
    if (req.files) {
      const imgPromises = req.files.map((image) =>
        cloudinary.uploader.upload(image.path, {
          folder: 'product_images',
          unique_filename: true
        })
      )
      const results = await Promise.allSettled(imgPromises)
      const imgUrls = results.map((result) => result.value.secure_url)
      updatedProduct.imgUrls = imgUrls
    }
    await Product.update(id, updatedProduct)
    res.redirect('/admin/products')
  } catch (err) {
    console.log(err)
  }
}
exports.postDeleteProduct = async (req, res) => {
  try {
    const { id } = req.body
    console.log(id)
    await Product.softDelete(id)
    res.redirect('/admin/products')
  } catch (err) {
    console.log(err)
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.fetchAll()
    res.render('admin/categories', { path: '/categories', categories })
  } catch (err) {
    console.log(err)
  }
}
exports.postAddCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName.toLowerCase()
    const newCategory = new Category(categoryName)
    await newCategory.save()
    console.log('Category Added')
    res.redirect('/admin/categories')
  } catch (err) {
    console.log(err)
  }
}
exports.postEditCategory = async (req, res) => {
  try {
    const { id } = req.body
    const updatedCategory = {
      categoryName: req.body.categoryName,
      updatedOn: new Date()
    }
    await Category.update(id, updatedCategory)
    res.redirect('/admin/categories')
  } catch (err) {
    console.log(err)
  }
}
exports.postDeleteCategory = async (req, res) => {
  try {
    const { id } = req.body
    console.log(id)
    await Category.softDelete(id)
    res.redirect('/admin/categories')
  } catch (err) {
    console.log(err)
  }
}

exports.getOrders = async (req, res) => {
  try {
    const { page } = req.query
    const skip = (page - 1) * ITEMS_PER_PAGE || 0
    const limit = ITEMS_PER_PAGE
    const totalOrders = await Order.count()
    const orders = await Order.fetchAll(skip, limit)
    orders.forEach((order) => {
      order.customer[0].addresses.forEach((address) => {
        if (address.id.toString() === order.shippingAddress.toString()) {
          order.shippingAddress = address
          delete order.customer
          delete order.items
        }
      })
    })

    console.log(orders)
    res.render('admin/orders', {
      path: '/orders',
      orders,
      totalOrders,
      skip,
      limit,
      page,
      currentPage: page,
      lastPage: Math.ceil(totalOrders / limit)
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postUpdateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body
    let data
    if (status === 'delivered') {
      data = { status, deliveredOn: new Date() }
    } else {
      data = { status }
    }
    await Order.updateOne(id, data)
    res.json('order status updated')
  } catch (err) {
    console.log(err)
  }
}
exports.getInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId
    const order = await Order.fetchById(orderId)
    order[0].customer[0].addresses.forEach((address) => {
      if (address.id.toString() === order[0].shippingAddress.toString()) {
        order[0].shippingAddress = address
        delete order[0].customer
      }
    })
    order[0].products.forEach((product) => {
      order[0].items.forEach((item) => {
        if (item.productId.toString() === product._id.toString()) {
          item.productName = product.productTitle
          item.imgUrl = product.imgUrls[0]
        }
      })
    })
    delete order[0].products
    res.render('admin/invoice', { path: '/orders', order: order[0] })
  } catch (err) {
    console.log(err)
  }
}

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.fetchAll()
    const changedCoupons = coupons.map((coupon) => {
      const dateString = coupon.expiresOn
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      coupon.expiresOn = new Date(dateString).toLocaleDateString(
        undefined,
        options
      )
      coupon.expiryDate = new Date(dateString).toISOString().substring(0, 10)
      return coupon
    })
    res.render('admin/coupons', {
      path: '/coupons',
      coupons: changedCoupons
    })
  } catch (err) {
    console.log(err)
  }
}
exports.postAddCoupon = async (req, res) => {
  try {
    const couponCode = req.body.couponCode.toUpperCase()
    const createdOn = new Date()
    const expiresOn = new Date(req.body.expiresOn)
    const { amount, minPurchase } = req.body
    const newCoupon = new Coupon(
      couponCode,
      amount,
      minPurchase,
      createdOn,
      expiresOn
    )
    await newCoupon.save()
    console.log('Coupon Added')
    res.redirect('/admin/coupons')
  } catch (err) {
    console.log(err)
  }
}
exports.postEditCoupon = async (req, res) => {
  try {
    const { id } = req.body
    const updatedCoupon = {
      couponCode: req.body.couponCode,
      amount: req.body.amount,
      minPurchase: req.body.minPurchase,
      expiresOn: new Date(req.body.expiresOn),
      updatedOn: new Date()
    }
    await Coupon.update(id, updatedCoupon)
    res.redirect('/admin/coupons')
  } catch (error) {
    console.log(error)
  }
}
exports.postDeleteCoupon = async (req, res) => {
  try {
    const { id } = req.body
    await Coupon.softDelete(id)
    res.redirect('/admin/coupons')
  } catch (error) {
    console.log(error)
  }
}

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.fetchAll()
    res.render('admin/banners', { path: '/banners', banners })
  } catch (error) {
    console.log(error)
  }
}
exports.postAddBanner = async (req, res) => {
  try {
    const { bannerTitle } = req.body
    const fileData = await cloudinary.uploader.upload(req.file.path, {
      folder: 'banner_images',
      unique_filename: true
    })
    const newBanner = new Banner(bannerTitle, fileData.secure_url)
    await newBanner.save()
    console.log('Banner Added')
    res.redirect('/admin/banners')
  } catch (err) {
    console.log(err)
  }
}
exports.postEditBanner = async (req, res) => {
  try {
    console.log(req.file)
    const { id } = req.body
    const updatedBanner = {
      bannerTitle: req.body.bannerTitle,
      updatedOn: new Date()
    }
    if (req.file) {
      const file = await cloudinary.uploader.upload(req.file.path, {
        folder: 'banner_images',
        unique_filename: true
      })
      updatedBanner.imgUrl = file.secure_url
    }
    await Banner.update(id, updatedBanner)
    res.redirect('/admin/banners')
  } catch (error) {
    console.log(error)
  }
}
exports.postDeleteBanner = async (req, res) => {
  try {
    const { id } = req.body
    await Banner.softDelete(id)
    res.redirect('/admin/banners')
  } catch (error) {
    console.log(error)
  }
}

exports.getCustomers = async (req, res) => {
  try {
    res.render('admin/customers', { path: '/customers' })
  } catch (err) {
    console.log(err)
  }
}
