const { ObjectId } = require("mongodb");
const getDb = require("../utils/database").getDb;

class Banner {
  constructor(bannerTitle, imgUrl) {
    this.bannerTitle = bannerTitle;
    this.imgUrl = imgUrl;
    this.active = true;
  }
  save() {
    const db = getDb();
    return db
      .collection("banners")
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
      .collection("banners")
      .find()
      .toArray()
      .then((banners) => banners)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Banner;
