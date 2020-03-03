require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const companyRouter = require('./api/routes/companies.routes');
const userRouter = require('./api/routes/users.routes');
const loginRouter = require('./api/routes/login.routes');
const orderRouter = require('./api/routes/order.routes');
const cors = require("cors")

const socket = require('socket.io');

const handlers = require('./api/handlers/users.handlers');
const config = require('./config');

const app = express();
const server = app.listen(config.server.port, () => {
  console.log(`Magic is happening on port ${config.server.port}`);
});


app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

app.use(userRouter)
app.use(companyRouter)
app.use(loginRouter)
app.use(orderRouter)

const io = socket(server);

mongoose.connect(config.db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}, () => {
  server
});

io.on('connection', (socket) => {
  console.log('Socket magic is happening', socket.id);
  socket.on('new_user', (userData) => {
    socket.broadcast.emit('update_user_list', userData);
    console.log('getting all users', userData);
  });
  socket.on('new_company', (companyData) => {
    socket.broadcast.emit('update_company_list', companyData);
  })
});