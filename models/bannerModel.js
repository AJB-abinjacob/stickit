const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Banner {
  constructor (bannerTitle, imgUrl) {
    this.bannerTitle = bannerTitle
    this.imgUrl = imgUrl
    this.createdOn = new Date()
    this.updatedOn = new Date()
  }

  save () {
    const db = getDb()
    return db
      .collection('banners')
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
      .collection('banners')
      .find({ deleted: { $ne: true } })
      .sort({ createdOn: -1 })
      .toArray()
      .then((banners) => banners)
      .catch((err) => {
        console.log(err)
      })
  }

  static update (id, data) {
    const db = getDb()
    return db
      .collection('banners')
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
      .collection('banners')
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

module.exports = Banner
