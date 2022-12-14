const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Category {
  constructor (categoryName) {
    this.categoryName = categoryName
    this.active = true
    this.createdOn = new Date()
    this.updatedOn = new Date()
  }

  save () {
    const db = getDb()
    return db
      .collection('categories')
      .insertOne(this)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static fetchAll () {
    const db = getDb()
    return db
      .collection('categories')
      .find({ deleted: { $ne: true } })
      .sort({ createdOn: -1 })
      .toArray()
      .then((categories) => categories)
      .catch((err) => {
        console.log(err)
      })
  }

  static update (id, data) {
    const db = getDb()
    return db
      .collection('categories')
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
      .collection('categories')
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

module.exports = Category
