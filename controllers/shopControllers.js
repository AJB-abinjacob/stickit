exports.getDashboard = (req, res) => {
  res.render("shop/dashboard");
};
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
