const path = require('path')
const fs = require('fs')
const https = require('https')

const express = require('express')
const nocache = require('nocache')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoConnect = require('./utils/database').mongoConnect
const compression = require('compression')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
})

// routes
const adminRoutes = require('./routes/adminRoutes')
const shopRoutes = require('./routes/shopRoutes')

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)
const privateKey = fs.readFileSync('server.key')
const certificate = fs.readFileSync('server.cert')

// global middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(nocache())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  })
)
app.use(flash())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))

// view engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// route middlewares
app.use('/admin', adminRoutes)
app.use('/', shopRoutes)

mongoConnect(() => {
  https
    .createServer({ key: privateKey, cert: certificate }, app)
    .listen(process.env.PORT || 3001, () => {
      console.log(`Running on PORT: ${process.env.PORT || 3001}`)
    })
})
