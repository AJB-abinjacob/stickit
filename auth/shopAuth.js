exports.isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next()
  } else {
    res.redirect('/login')
  }
}

exports.isLoggedOut = (req, res, next) => {
  if (!req.session.userId) {
    next()
  } else {
    res.redirect('/')
  }
}
