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
  res.render("admin/products", { path: "/products" });
};
exports.getCategories = (req, res) => {
  res.render("admin/categories", { path: "/categories" });
};
exports.getOrders = (req, res) => {
  res.render("admin/orders", { path: "/orders" });
};

exports.getInvoice = (req, res) => {
  const orderId = req.params.orderId;
  res.render("admin/invoice", { path: "/orders", orderId: orderId });
};

exports.getCoupons = (req, res) => {
  res.render("admin/coupons", { path: "/coupons" });
};
exports.getBanners = (req, res) => {
  res.render("admin/banners", { path: "/banners" });
};
exports.getCustomers = (req, res) => {
  res.render("admin/customers", { path: "/customers" });
};
