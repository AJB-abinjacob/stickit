const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Product {
  constructor (productTitle, category, productPrice, discount, stock, imgUrls) {
    this.productTitle = productTitle
    this.productPrice = productPrice
    this.discount = discount
    this.stock = stock
    this.category = ObjectId(category)
    this.imgUrls = imgUrls
    this.createdOn = new Date()
    this.updatedOn = new Date()
  }

  save () {
    const db = getDb()
    return db
      .collection('products')
      .insertOne(this)
  }

  static count () {
    const db = getDb()
    return db.collection('products').countDocuments({ deleted: { $ne: true } })
  }

  static countByCategoryId (categoryId) {
    const db = getDb()
    return db.collection('products').countDocuments({
      deleted: { $ne: true },
      category: ObjectId(categoryId)
    })
  }

  static countByValue (value) {
    const db = getDb()
    return db.collection('products').countDocuments({
      deleted: { $ne: true },
      productTitle: { $regex: value, $options: 'i' }
    })
  }

  static fetchAll (skip, limit) {
    const db = getDb()
    return db
      .collection('products')
      .aggregate([
        { $match: { deleted: { $ne: true } } },
        { $sort: { createdOn: -1 } },
        { $skip: skip || 0 },
        { $limit: limit },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryName'
          }
        }
      ])
      .toArray()
  }

  static fetchById (id) {
    const db = getDb()
    return db.collection('products').findOne({ _id: ObjectId(id) })
  }

  static fetchByCategory (id, skip, limit) {
    const db = getDb()
    return db
      .collection('products')
      .aggregate([
        { $match: { category: ObjectId(id), deleted: { $ne: true } } },
        { $sort: { createdOn: -1 } },
        { $skip: skip || 0 },
        { $limit: limit }
      ])
      .toArray()
  }

  static fetchByValue (value, skip, limit) {
    const db = getDb()
    return db
      .collection('products')
      .aggregate([
        {
          $match: {
            deleted: { $ne: true },
            productTitle: { $regex: value, $options: 'i' }
          }
        },
        { $sort: { createdOn: -1 } },
        { $skip: skip || 0 },
        { $limit: limit }
      ])
      .toArray()
  }

  static update (id, data) {
    const db = getDb()
    return db.collection('products').updateOne(
      { _id: ObjectId(id) },
      {
        $set: data
      }
    )
  }

  static softDelete (id) {
    const db = getDb()
    return db.collection('products').updateOne(
      { _id: ObjectId(id) },
      {
        $set: { deleted: true }
      }
    )
  }
}

module.exports = Product
