require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const companyRouter = require('./api/routes/companies.routes')
const userRouter = require('./api/routes/users.routes')
const loginRouter = require('./api/routes/login.routes')
const orderRouter = require('./api/routes/order.routes')
const cors = require('cors')
const User = require('./api/models/users.model')
const Company = require('./api/models/company.model')
const Order = require('./api/models/order.model')

const socket = require('socket.io')

const config = require('./config')

const app = express()
const server = app.listen(config.server.port, () => {
  console.log(`Magic is happening on port ${config.server.port}`)
})

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

app.use(userRouter)
app.use(companyRouter)
app.use(loginRouter)
app.use(orderRouter)

const io = socket(server)

mongoose.connect(
  config.db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
},
  () => {
    server
  }
)

io.on('connection', socket => {
  console.log('Socket magic is happening', socket.id)
  socket.on('new_account', async (accountData) => {
    const user = await User.findOne({
      email: accountData.data.email
    })
    const company = await Company.findOne({
      email: accountData.data.email
    })
    if (user) {
      socket.broadcast.emit('update_user_list', user)
    }
    else if (company) {
      socket.broadcast.emit('update_company_list', company)
    }
    else {
      return res.status(500).send({
        message: 'Something went wrong try later',
      })
    }
  })
  socket.on('delete_user', () => {
    socket.broadcast.emit('deleted_user', { data: 'User has been deleted, please refresh' })
  })
  socket.on('delete_company', () => {
    socket.broadcast.emit('deleted_company', { data: 'Company has been deleted, please refresh' })
  })
  socket.on('new_order', orderData => {
    Order.findOne({
      companyId: orderData.data.companyId
    }).then((data) => {
      socket.broadcast.emit('update_order_list', data)
    }).catch(err => {
      return res.status(500).send({
        message: 'Something went wrong try later',
        err,
      })
    })
  })
  socket.on('delete_order', () => {
    socket.broadcast.emit('deleted_order', { data: 'Order has been deleted, please refresh' })
  })
})