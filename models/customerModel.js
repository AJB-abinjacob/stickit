const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Customer {
  constructor (name, email, phone, password) {
    this.name = name
    this.email = email
    this.phone = phone
    this.password = password
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
}

module.exports = Customer
