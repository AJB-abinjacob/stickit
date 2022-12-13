exports.getLogin = (req, res) => {
  res.render("shop/logins/login");
};
exports.getOtpLogin = (req, res) => {
  res.render("shop/logins/otp-login");
};
exports.postVerifyPhone = (req, res) => {
  const { phone } = req.body;
  res.render("shop/logins/verify-otp", { phone });
};
exports.getSignup = (req, res) => {
  res.render("shop/logins/signup");
};
exports.getResetPassword = (req, res) => {
  res.render("shop/logins/reset-password");
};

exports.getHome = async (req, res) => {
  res.render("shop/home");
};
exports.getProduct = async (req, res) => {
  console.log(req.params.id);
  res.render("shop/product");
};
exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  res.render("shop/show-products", { category });
};
exports.getProductsBySearch = async (req, res) => {
  let category; // need undefined value
  const query = req.query.search;
  console.log(query);
  res.render("shop/show-products", { category, query });
};

exports.getWishlist = async (req, res) => {
  res.render("shop/wishlist");
};

exports.getCart = async (req, res) => {
  res.render("shop/cart");
};

exports.getAccount = async (req, res) => {
  res.render("shop/account", { path: "/account" });
};
exports.getAddresses = async (req, res) => {
  res.render("shop/account", { path: "/addresses" });
};
exports.getAddAddress = async (req, res) => {
  res.render("shop/account", { path: "/add-address" });
};
exports.getOrders = async (req, res) => {
  res.render("shop/account", { path: "/orders" });
};
