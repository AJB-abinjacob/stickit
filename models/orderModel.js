const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Order {
  constructor (customerId, items, specialInstruction, shippingAddress, payment) {
    this.customerId = ObjectId(customerId)
    this.items = items
    this.specialInstruction = specialInstruction
    this.shippingAddress = ObjectId(shippingAddress)
    this.payment = payment
    this.status = 'pending'
    this.createdOn = new Date()
  }

  save () {
    const db = getDb()
    return db.collection('orders').insertOne(this)
  }

  static fetchAll () {
    const db = getDb()
    return db.collection('orders').find().sort({ createdOn: -1 }).toArray()
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

  static update (id, data) {
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
