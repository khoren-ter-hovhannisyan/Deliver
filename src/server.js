require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const companyRouter = require('./api/routes/companies.routes')
const userRouter = require('./api/routes/users.routes')
const loginRouter = require('./api/routes/login.routes')
const orderRouter = require('./api/routes/order.routes')
const cors = require('cors')

const config = require('./config')

const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

app.use(userRouter)
app.use(companyRouter)
app.use(loginRouter)
app.use(orderRouter)

mongoose.connect(
  config.db.url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    app.listen(config.server.port, () => {
      console.log(`Magic is happening on port ${config.server.port}`)
    })
  }
)
