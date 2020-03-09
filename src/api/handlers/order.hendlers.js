const moment = require('moment')

const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')

const sendEmail = require('../../services/sendEmail')

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
        receiver_name: orders[i].receiver_name,
        receiver_phone: orders[i].receiver_phone,
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
        receiver_name: orders[i].receiver_name,
        receiver_phone: orders[i].receiver_phone,
        comment: orders[i].comment,
        user_name: undefined,
        user_phone: undefined,
        user_email: undefined,
      }
      if (orders[i].state === 'done' || orders[i].state === 'pending') {
        order.user_name = user ? user.name : 'User has been deleted'
        order.user_phone = user ? user.phone : 'User has been deleted'
        order.user_email = user ? user.email : 'User has been deleted'
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
    const orderCheck = await Order.findOne({ _id })
    if (
      !orderCheck ||
      (req.body.state === undefined && orderCheck.state === 'pending') ||
      (req.body.state === undefined && orderCheck.state === 'done')
    ) {
      return res.status(400).send({
        message: 'Something went wrong , you can`t do that',
      })
    }

    const order = await Order.findByIdAndUpdate(
      _id,
      { ...req.body },
      { new: true }
    )

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

    return res.status(201).send({
      id: order._id,
      state: order.state,
      points: order.points,
      order_description: order.order_description,
      take_address: order.take_address,
      deliver_address: order.deliver_address,
      order_create_time: moment(order.order_create_time).format('LLL'),
      order_start_time: moment(order.order_start_time).format('LLL'),
      order_end_time: moment(order.order_end_time).format('LLL'),
      receiver_name: order.receiver_name,
      receiver_phone: order.receiver_phone,
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
