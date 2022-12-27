const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb

class Admin {
  static findById (id) {
    const db = getDb()
    return db
      .collection('admins')
      .find({ _id: ObjectId(id) })
      .toArray()
  }

  static findByEmail (email) {
    const db = getDb()
    return db.collection('admins').findOne({ email })
  }

  static update (id, data) {
    const db = getDb()
    return db.collection('admins').updateOne(
      { _id: ObjectId(id) },
      {
        $set: data
      }
    )
  }
}
module.exports = Admin
