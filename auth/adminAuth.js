exports.isLoggedIn = (req, res, next) => {
  if (req.session.adminId) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}

exports.isLoggedOut = (req, res, next) => {
  if (!req.session.adminId) {
    next()
  } else {
    res.redirect('/admin')
  }
}
