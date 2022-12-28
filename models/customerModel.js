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

  static findById (id) {
    const db = getDb()
    return db
      .collection('customers')
      .find({ _id: ObjectId(id) })
      .project({ name: 1, email: 1, phone: 1 })
      .toArray()
  }

  static findByIdForPassword (id) {
    const db = getDb()
    return db
      .collection('customers')
      .find({ _id: ObjectId(id) })
      .project({ password: 1 })
      .toArray()
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
  }

  static fetchAdresses (id) {
    const db = getDb()
    return db
      .collection('customers')
      .find({ _id: ObjectId(id) })
      .project({ addresses: 1 })
      .toArray()
  }

  static addAddress (id, address) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne({ _id: ObjectId(id) }, { $push: { addresses: address } })
  }

  static update (id, data) {
    const db = getDb()
    return db.collection('customers').updateOne(
      { _id: ObjectId(id) },
      {
        $set: data
      }
    )
  }

  static softDelete (id) {
    const db = getDb()
    return db.collection('customers').updateOne(
      { _id: ObjectId(id) },
      {
        $set: { deleted: true }
      }
    )
  }

  static deleteOne (id) {
    const db = getDb()
    return db.collection('customers').deleteOne({ _id: ObjectId(id) })
  }

  static fetchCart (userId) {
    const db = getDb()
    return db
      .collection('customers')
      .find({ _id: ObjectId(userId) })
      .project({ cart: 1 })
      .toArray()
  }

  static fetchCartItems (userId) {
    const db = getDb()
    return db
      .collection('customers')
      .aggregate([
        { $match: { _id: ObjectId(userId) } },
        { $project: { cart: 1 } },
        {
          $lookup: {
            from: 'products',
            localField: 'cart.productId',
            foreignField: '_id',
            as: 'products'
          }
        }
      ])
      .toArray()
  }

  static async addToCart (userId, product) {
    const db = getDb()
    let productExist
    const userCart = await db
      .collection('customers')
      .find({ _id: ObjectId(userId) })
      .project({ cart: 1 })
      .toArray()
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
            'cart.$.quantity': product.quantity
          }
        }
      )
    }
    return db
      .collection('customers')
      .updateOne({ _id: ObjectId(userId) }, { $addToSet: { cart: product } })
  }

  static removeFromCart (userId, productId) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne(
        { _id: ObjectId(userId) },
        { $pull: { cart: { productId: ObjectId(productId) } } }
      )
  }

  static clearCart (userId) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne({ _id: ObjectId(userId) }, { $set: { cart: [] } })
  }

  static decrementQuantity (userId, productId) {
    const db = getDb()
    return db
      .collection('customers')
      .updateOne(
        { _id: ObjectId(userId), 'cart.productId': ObjectId(productId) },
        { $inc: { 'cart.$.quantity': -1 } }
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

  static fetchWishlistItems (userId) {
    const db = getDb()
    return db
      .collection('customers')
      .aggregate([
        { $match: { _id: ObjectId(userId) } },
        { $project: { wishlist: 1 } },
        {
          $lookup: {
            from: 'products',
            localField: 'wishlist',
            foreignField: '_id',
            as: 'products'
          }
        },
        { $project: { products: 1 } }
      ])
      .toArray()
  }

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
      .updateOne({ _id: ObjectId(userId) }, { $pull: { wishlist: product } })
  }
}
module.exports = Customer
