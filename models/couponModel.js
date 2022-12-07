const { ObjectId } = require("mongodb");
const getDb = require("../utils/database").getDb;

class Coupon {
  constructor(couponCode, amount, minPurchase, createdOn, expiresOn) {
    this.couponCode = couponCode;
    this.amount = amount;
    this.minPurchase = minPurchase;
    this.createdOn = createdOn;
    this.expiresOn = expiresOn;
    this.active = true;
  }
  save() {
    const db = getDb();
    return db
      .collection("coupons")
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
      .collection("coupons")
      .find()
      .toArray()
      .then((coupons) => coupons)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Coupon;
