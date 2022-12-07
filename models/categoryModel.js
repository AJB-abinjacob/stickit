const { ObjectId } = require("mongodb");
const getDb = require("../utils/database").getDb;

class Category {
  constructor(categoryName) {
    this.categoryName = categoryName;
    this.active = true;
  }
  save() {
    const db = getDb();
    return db
      .collection("categories")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("categories")
      .find({ deleted: { $ne: true } })
      .toArray()
      .then((categories) => categories)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Category;
