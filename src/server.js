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

const { socketListeners } = require('./socket')
const db = require('./api/db/db')

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
db(server)
// TODO: db.j file sarqel tanel mongoose.connect@ et faili mej

io.on('connection', socket => socketListeners(socket))
