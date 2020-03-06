const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')
const sendEmail = require('../../services/sendEmail')
const moment = require('moment')

exports.createOrder = async (req, res) => {
  const { companyId, order } = req.body
  const company = await Company.findOne({ _id: companyId })
  if (order.points > company.amount) {
    return res
      .status(400)
      .send({ message: "You don't have enough money to create order" })
  }
  const newOrder = new Order({
    ...order,
    companyId,
  })

  newOrder.save(err => {
    if (err) {
      return res.status(404).send({
        message: 'Something went wrong, try later',
        err,
      })
    }
    return res.status(201).send({ message: 'Order created' })
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
        take_address: orders[i].take_address,
        deliver_address: orders[i].deliver_address,
        order_create_time: moment(orders[i].order_create_time).format('LLL'),
        order_start_time: moment(orders[i].order_start_time).format('LLL'),
        order_end_time: moment(orders[i].order_end_time).format('LLL'),
        comment: orders[i].comment,
        company_name: company.name,
        company_phone: company.phone,
        company_email: company.email,
      }
      ordersOutput.push(order)
    }
    return res.status(200).send(ordersOutput)
  } catch (err) {
    return res.status(500).send({ message: 'Something went wrong, try later' })
  }
}

exports.getCompanyOrders = async (req, res) => {
  const _id = req.params.id
  try {
    const orders = await Order.find({ companyId: _id })
    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const user = await Users.findOne({ _id: orders[i].userId })
      const order = {
        id: orders[i]._id,
        state: orders[i].state,
        points: orders[i].points,
        order_description: orders[i].order_description,
        take_address: orders[i].take_address,
        deliver_address: orders[i].deliver_address,
        order_create_time: moment(orders[i].order_create_time).format('LLL'),
        order_start_time: moment(orders[i].order_start_time).format('LLL'),
        order_end_time: moment(orders[i].order_end_time).format('LLL'),
        comment: orders[i].comment,
        user_name: user ? user.name : undefined,
        user_phone: user ? user.phone : undefined,
        user_email: user ? user.email : undefined,
      }
      ordersOutput.push(order)
    }
    return res.status(200).send(ordersOutput)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong, try later', err })
  }
}

exports.delOrder = async (req, res) => {
  const _id = req.params.id
  try {
    await Order.findByIdAndRemove({
      _id,
    })
    res.status(202).send({
      message: 'Order deleted',
    })
  } catch (err) {
    res.status(404).send({ message: 'Something went wrong, try later', err })
  }
}

exports.updateOrder = async (req, res) => {
  const _id = req.params.id
  try {
    const order = await Order.findByIdAndUpdate(
      _id,
      { ...req.body },
      { new: true }
    )
    if (!order) {
      res.status(400).send({
        message: 'There is no such order',
      })
    }
    const company = await Company.findOne({ _id: order.companyId })
    const user = await Users.findOne({ _id: order.userId })
    if (order.state === 'pending') {
      sendEmail.sendAcceptOrderEmail(company, user)
    } else if (order.state === 'done') {
      await Company.findByIdAndUpdate(
        company._id,
        { amount: company.amount - order.points },
        { new: true }
      )
      await user.findByIdAndUpdate(
        user._id,
        {
          amount: user.amount + order.amount,
        },
        { new: true }
      )
      sendEmail.sendDoneOrderEmail(company, user)
    }
    res.status(201).send({
      id: order._id,
      state: order.state,
      points: order.points,
      order_description: order.order_description,
      take_address: order.take_address,
      deliver_address: order.deliver_address,
      order_create_time: moment(order.order_create_time).format('LLL'),
      order_start_time: moment(order.order_start_time).format('LLL'),
      order_end_time: moment(order.order_end_time).format('LLL'),
      comment: order.comment,
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
      .send({ message: 'Something went wrong, try later', err })
  }
}

exports.getUserOrders = async (req, res) => {
  const _id = req.params.id
  try {
    const user = await Users.findOne({ _id })
    if (!user) {
      res.status(400).send({
        message: 'There is no such user',
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
        take_address: orders[i].take_address,
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
    return res.status(200).send(ordersOutput)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong, try later', err })
  }
}
