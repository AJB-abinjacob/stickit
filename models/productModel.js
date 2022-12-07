const { ObjectId } = require("mongodb");
const getDb = require("../utils/database").getDb;

class Product {
  constructor(productTitle, category, productPrice, salePrice, stock, imgUrls) {
    this.productTitle = productTitle;
    this.productPrice = productPrice;
    this.salePrice = salePrice;
    this.stock = stock;
    this.category = ObjectId(category);
    this.imgUrls = imgUrls;
    this.active = true;
    this.created_on = new Date();
  }
  save() {
    const db = getDb();
    return db
      .collection("products")
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
      .collection("products")
      .aggregate([
        { $match: { deleted: { $ne: true } } },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryName",
          },
        },
      ])
      .toArray()
      .then((products) => products)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
