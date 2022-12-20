const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Customer {
  constructor (name, email, phone, password) {
    this.name = name
    this.email = email
    this.phone = phone
    this.password = password
    this.cart = []
    this.wishlist = []
    this.active = true
    this.createdOn = new Date()
    this.updatedOn = new Date()
  }

  save () {
    const db = getDb()
    return db
      .collection('customers')
      .insertOne(this)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static findByEmail (email) {
    const db = getDb()
    return db.collection('customers').findOne({ email })
  }

  static findByPhone (phone) {
    const db = getDb()
    return db.collection('customers').findOne({ phone })
  }

  static fetchAll () {
    const db = getDb()
    return db
      .collection('customers')
      .find({ deleted: { $ne: true } })
      .sort({ createdOn: -1 })
      .toArray()
      .then((coupons) => coupons)
      .catch((err) => {
        console.log(err)
      })
  }

  static update (id, data) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: data
        }
      )
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static softDelete (id) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: { deleted: true }
        }
      )
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static async addToCart (userId, product) {
    const db = getDb()
    let productExist
    const userCart = await db
      .collection('customers')
      .find({ _id: ObjectId(userId) })
      .project({ cart: 1 })
      .toArray()
    console.log(userCart)
    if (userCart[0].cart.length > 0) {
      userCart[0].cart.forEach((item) => {
        if (item.productId.toString() === product.productId.toString()) {
          productExist = true
        }
      })
    }
    if (productExist) {
      return db.collection('customers').updateOne(
        {
          _id: ObjectId(userId),
          'cart.productId': ObjectId(product.productId)
        },
        {
          $inc: {
            'cart.$.quantity': 1
          }
        }
      )
    }
    return db
      .collection('customers')
      .updateOne({ _id: ObjectId(userId) }, { $addToSet: { cart: product } })
  }

  static async removeFromCart (userId, product) {}

  static async addToWishlist (userId, product) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne(
        { _id: ObjectId(userId) },
        { $addToSet: { wishlist: product } }
      )
  }

  static async removeFromWishlist (userId, product) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne(
        { _id: ObjectId(userId) },
        { $pull: { wishlist: product } }
      )
  }

  static fetchWishlist (userId) {
    const db = getDb()
    return db
      .collection('customers')
      .find({ _id: ObjectId(userId) })
      .project({ wishlist: 1 })
      .toArray()
  }
}
module.exports = Customer
