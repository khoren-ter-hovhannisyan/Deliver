const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')
const sendEmail = require('../../services/sendEmail')

exports.createOrder = (req, res) => {
  const { companyId, order } = req.body

  const newOrder = new Order({
    ...order,
    companyId,
  })

  newOrder
    .save((err, newOrder) => {
      if (err) {
        return res.status(404).send({
          message: 'Something went wrong, try again in a few minutes',
          err,
        })
      }
      return res.status(201).send({ message: 'Order created' })
    })
    .catch(err => {
      return res
        .status(500)
        .send({
          message: 'Something went wrong, try again in a few minutes',
          err,
        })
    })
}

exports.getAllActiveOrder = async (req, res) => {
  try {
    const orders = await Order.find({ state: 'active' })
    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const company = await Company.findOne({ _id: orders[0].companyId })
      const order = {
        id: orders[i]._id,
        state: orders[i].state,
        points: orders[i].points,
        order_description: orders[i].order_description,
        take_adress: orders[i].take_adress,
        deliver_address: orders[i].deliver_address,
        order_create_time: orders[i].order_create_time,
        order_start_time: orders[i].order_start_time,
        order_end_time: orders[i].order_end_time,
        comment: orders[i].comment,
        icon: orders[i].icon,
        company_name: company.name,
        company_phone: company.phone,
        company_email: company.email,
      }
      ordersOutput.push(order)
    }
    return res.status(201).send(ordersOutput)
  } catch (err) {
    return res.status(500).send({ message: 'Something went wron try later' })
  }
}

exports.getCompanyOrders = async (req, res) => {
  const _id = req.params.id
  try {
    const company = await Company.findOne({ _id })
    if (!company) {
      res.status(400).send({
        message: 'There is no company',
      })
    }
    const orders = await Order.find({ companyId: _id })
    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const user = await Users.findOne({ _id: orders[i].userId })
      const order = {
        id: orders[i]._id,
        state: orders[i].state,
        points: orders[i].points,
        order_description: orders[i].order_description,
        take_adress: orders[i].take_adress,
        deliver_address: orders[i].deliver_address,
        order_create_time: orders[i].order_create_time,
        order_start_time: orders[i].order_start_time,
        order_end_time: orders[i].order_end_time,
        comment: orders[i].comment,
        icon: orders[i].icon,
        company_name: company.name,
        company_phone: company.phone,
        company_email: company.email,
        user_name: user ? user.name : undefined,
        user_phone: user ? user.phone : undefined,
        user_email: user ? user.email : undefined,
      }
      ordersOutput.push(order)
    }
    return res.status(201).send(ordersOutput)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wron try later', err })
  }
}

exports.delOrder = async (req, res) => {
  const _id = req.params.id
  try {
    await Order.findByIdAndRemove({
      _id,
    })
    res.status(201).send({
      message: 'Order deleted',
    })
  } catch (err) {
    res.status(404).send(err)
  }
}

exports.updateOrder = async (req, res) => {
  const _id = req.params.id
  try {
    const order = await Order.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    )
    if (!order) {
      res.status(400).send({
        message: 'There is not order like that',
      })
    }
    const company = await Company.findOne({ _id: order.companyId })
    const user = await Users.findOne({ _id: order.userId })
    if (order.state === 'pending') {
      sendEmail.sendAcceptOrderEmail(company, user)
    } else if (order.state === 'done') {
      sendEmail.sendDoneOrderEmail(company, user)
    }
    res.status(201).send({
      id: order._id,
      state: order.state,
      points: order.points,
      order_description: order.order_description,
      take_adress: order.take_adress,
      deliver_address: order.deliver_address,
      order_create_time: order.order_create_time,
      order_start_time: order.order_start_time,
      order_end_time: order.order_end_time,
      comment: order.comment,
      icon: orders[i].icon,
      company_name: company.name,
      company_phone: company.phone,
      company_email: company.email,
      user_name: user ? user.name : undefined,
      user_phone: user ? user.phone : undefined,
      user_email: user ? user.email : undefined,
    })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wron try later', err })
  }
}

exports.getUserOrders = async (req, res) => {
  const _id = req.params.id
  try {
    const user = await Users.findOne({ _id })
    if (!user) {
      res.status(400).send({
        message: 'There is no user',
      })
    }
    const orders = await Order.find({ userId: _id })
    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const company = await Company.findOne({ _id: orders[i].companyId })
      const order = {
        id: orders[i]._id,
        state: orders[i].state,
        points: orders[i].points,
        order_description: orders[i].order_description,
        take_adress: orders[i].take_adress,
        deliver_address: orders[i].deliver_address,
        order_create_time: orders[i].order_create_time,
        order_start_time: orders[i].order_start_time,
        order_end_time: orders[i].order_end_time,
        comment: orders[i].comment,
        icon: orders[i].icon,
        company_name: company.name,
        company_phone: company.phone,
        company_email: company.email,
        user_name: user.name,
        user_phone: user.phone,
        user_email: user.email,
      }
      ordersOutput.push(order)
    }
    return res.status(201).send(ordersOutput)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wron try later', err })
  }
}
