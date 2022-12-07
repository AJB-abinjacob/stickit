const cloudinary = require("../utils/cloudinary");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Coupon = require("../models/couponModel");
const Banner = require("../models/bannerModel");

exports.getLogin = (req, res) => {
  res.render("admin/login");
};
exports.postLogin = (req, res) => {
  res.redirect("/admin");
};

exports.postLogout = (req, res) => {
  res.redirect("/admin/login");
};

exports.getHome = (req, res) => {
  res.render("admin/dashboard", { path: "/" });
};
exports.getProducts = (req, res) => {
  Category.fetchAll()
    .then((categories) => categories)
    .then((categories) => {
      Product.fetchAll().then((products) => {
        res.render("admin/products", {
          path: "/products",
          categories,
          products,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res) => {
  const { productTitle, productCategory, productPrice, salePrice, stock } =
    req.body;
  const imgPromises = req.files.map((image) =>
    cloudinary.uploader.upload(image.path, {
      folder: "product_images",
      unique_filename: true,
    })
  );
  Promise.allSettled(imgPromises)
    .then((results) => {
      return (imgUrls = results.map((result) => result.value.secure_url));
    })
    .then((imgUrls) => {
      const newProduct = new Product(
        productTitle,
        productCategory,
        productPrice,
        salePrice,
        stock,
        imgUrls
      );
      newProduct
        .save()
        .then(() => {
          console.log("Product Added");
          res.redirect("/admin/products");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategories = (req, res) => {
  Category.fetchAll().then((categories) => {
    res.render("admin/categories", { path: "/categories", categories });
  });
};
exports.postAddCategory = (req, res) => {
  const categoryName = req.body.categoryName.toLowerCase();
  const newCategory = new Category(categoryName);
  newCategory
    .save()
    .then(() => {
      console.log("Category Added");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res) => {
  res.render("admin/orders", { path: "/orders" });
};

exports.getInvoice = (req, res) => {
  const orderId = req.params.orderId;
  res.render("admin/invoice", { path: "/orders", orderId: orderId });
};

exports.getCoupons = (req, res) => {
  Coupon.fetchAll()
    .then((coupons) => {
      console.log(coupons);
      const changedCoupons = coupons.map((coupon) => {
        const dateString = coupon.expiresOn;
        const options = { year: "numeric", month: "short", day: "numeric" };
        coupon.expiresOn = new Date(dateString).toLocaleDateString(
          undefined,
          options
        );
        return coupon;
      });

      res.render("admin/coupons", {
        path: "/coupons",
        coupons: changedCoupons,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postAddCoupon = (req, res) => {
  const couponCode = req.body.couponCode.toUpperCase();
  const createdOn = new Date();
  const expiresOn = new Date(req.body.expiresOn);
  const { amount, minPurchase } = req.body;
  const newCoupon = new Coupon(
    couponCode,
    amount,
    minPurchase,
    createdOn,
    expiresOn
  );
  newCoupon
    .save()
    .then(() => {
      console.log("Coupon Added");
      res.redirect("/admin/coupons");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getBanners = (req, res) => {
  Banner.fetchAll()
    .then((banners) => {
      console.log(banners);
      res.render("admin/banners", { path: "/banners", banners });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postAddBanner = (req, res) => {
  const { bannerTitle } = req.body;

  cloudinary.uploader
    .upload(req.file.path, {
      folder: "banner_images",
      unique_filename: true,
    })
    .then((fileData) => {
      const newBanner = new Banner(bannerTitle, fileData.secure_url);
      newBanner
        .save()
        .then(() => {
          console.log("Banner Added");
          res.redirect("/admin/banners");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCustomers = (req, res) => {
  res.render("admin/customers", { path: "/customers" });
};
