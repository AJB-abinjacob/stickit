const path = require('path')

const express = require('express')
const nocache = require('nocache')
const session = require('express-session')
const flash = require('connect-flash')
const mongoConnect = require('./utils/database').mongoConnect
require('dotenv').config()
const app = express()

// routes
const adminRoutes = require('./routes/adminRoutes')
const shopRoutes = require('./routes/shopRoutes')

// global middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(nocache())
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  })
)
app.use(flash())

// view engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// route middlewares
app.use('/admin', adminRoutes)
app.use('/', shopRoutes)

mongoConnect(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Running on PORT: ${process.env.PORT}`)
  })
})
