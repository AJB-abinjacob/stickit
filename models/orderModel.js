const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Order {
  constructor (customerId, items, specialInstruction, shippingAddress, payment) {
    this.customerId = ObjectId(customerId)
    this.items = items
    this.specialInstruction = specialInstruction
    this.shippingAddress = ObjectId(shippingAddress)
    this.payment = payment
    this.status = 'processing'
    this.createdOn = new Date()
  }

  save () {
    const db = getDb()
    return db.collection('orders').insertOne(this)
  }

  static count () {
    const db = getDb()
    return db.collection('orders').countDocuments({})
  }

  static fetchAll (skip, limit) {
    const db = getDb()
    return db
      .collection('orders')
      .aggregate([
        { $sort: { createdOn: -1 } },
        { $skip: skip || 0 },
        { $limit: limit },
        {
          $lookup: {
            from: 'customers',
            localField: 'shippingAddress',
            foreignField: 'addresses.id',
            as: 'customer'
          }
        },
        {
          $project: {
            shippingAddress: 1,
            payment: 1,
            status: 1,
            createdOn: 1,
            customer: 1
          }
        }
      ])
      .toArray()
  }

  static fetchById (orderId) {
    const db = getDb()
    return db
      .collection('orders')
      .aggregate([
        { $match: { _id: ObjectId(orderId) } },
        {
          $lookup: {
            from: 'customers',
            localField: 'shippingAddress',
            foreignField: 'addresses.id',
            as: 'customer'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'products'
          }
        }
      ])
      .toArray()
  }

  static fetchByUser (userId) {
    const db = getDb()
    return db
      .collection('orders')
      .aggregate([
        { $match: { customerId: ObjectId(userId) } },
        { $sort: { createdOn: -1 } },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'products'
          }
        }
      ])
      .toArray()
  }

  static updateOne (id, data) {
    const db = getDb()
    return db.collection('orders').updateOne(
      { _id: ObjectId(id) },
      {
        $set: data
      }
    )
  }

  //   static softDelete (id) {
  //     const db = getDb()
  //     return db
  //       .collection('orders')
  //       .updateOne(
  //         { _id: ObjectId(id) },
  //         {
  //           $set: { deleted: true }
  //         }
  //       )
  //       .then((result) => {
  //         console.log(result)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })
  //   }
}

module.exports = Order
