require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const socket = require('socket.io')

const companyRouter = require('./api/routes/companies.routes')
const userRouter = require('./api/routes/users.routes')
const loginRouter = require('./api/routes/login.routes')
const orderRouter = require('./api/routes/order.routes')

const User = require('./api/models/users.model')
const Company = require('./api/models/company.model')
const Order = require('./api/models/order.model')

const config = require('./config')

const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

app.use(userRouter)
app.use(companyRouter)
app.use(loginRouter)
app.use(orderRouter)

const server = app.listen(config.server.port, () => {
  console.log(`Magic is happening on port ${config.server.port}`)
})

// TODO: tanel arandzin fayli mej socett-i het kapvac amen inj , sarqel constantner bolor str-ner@, 
// TODO: socetnerin kpcnel token-i stugum@

const io = socket(server)

// TODO: db.j file sarqel tanel mongoose.connect@ et faili mej 

mongoose.connect(
  config.db.url,
  {
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
  socket.on('new_account', async accountData => {
    const user = await User.findOne({
      email: accountData.data.email,
    })
    const company = await Company.findOne({
      email: accountData.data.email,
    })
    if (user) {
      socket.broadcast.emit('update_user_list', {
        id: user._id,
        name: user.name,
        lastName: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        type: user.type,
        approved: user.approved,
        passportURL: user.passportURL,
        avatar: user.avatar,
        amount: user.amout,
        rating: user.rating,
        createdTime: Date.parse(user.createdTime),
      })
    } else if (company) {
      socket.broadcast.emit('update_company_list', {
        id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        taxNumber: company.taxNumber,
        address: company.address,
        approved: company.approved,
        activity: company.activity,
        avatar: company.avatar,
        amount: company.amount,
        createdTime: Date.parse(company.createdTime),
      })
    } else {
      return res.status(500).send({
        message: 'Something went wrong try later',
      })
    }
  })
  socket.on('delete_user', () => {
    socket.broadcast.emit('deleted_user', {
      data: 'User has been deleted, please refresh',
    })
  })
  socket.on('delete_company', () => {
    socket.broadcast.emit('deleted_company', {
      data: 'Company has been deleted, please refresh',
    })
  })
  socket.on('new_order', orderData => {
    Order.findOne({
      companyId: orderData.data.companyId,
    })
      .then(data => {
        socket.broadcast.emit('update_order_list', data)
      })
      .catch(err => {
        return res.status(500).send({
          message: 'Something went wrong try later',
          err,
        })
      })
  })
  socket.on('delete_order', () => {
    socket.broadcast.emit('deleted_order', {
      data: 'Order has been deleted, please refresh',
    })
  })
})
