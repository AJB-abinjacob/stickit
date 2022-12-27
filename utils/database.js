const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      console.log('Database Connected!')
      _db = client.db()
      callback(client)
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  // eslint-disable-next-line no-throw-literal
  throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
