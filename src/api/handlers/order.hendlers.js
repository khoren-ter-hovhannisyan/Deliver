const moment = require('moment')

const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')

const sendEmail = require('../../services/sendEmail')

const { types, status, messages } = require('../../utils/constans')

exports.createOrder = async (req, res) => {
  try {
    const { companyId, order } = req.body
    const company = await Company.findOne({ _id: companyId })
    if (!((`${company._id}` === companyId) === req.userData.id)) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    if (Number(order.points) > Number(company.amount)) {
      return res.status(400).send({ message: messages.errorMessage })
    }
    const newOrder = new Order({
      ...order,
      companyId,
    })

    newOrder.save(err => {
      if (err) {
        return res.status(500).send({
          message: messages.errorMessage,
        })
      }
      return res.status(201).send({ message: 'Order created' })
    })
  } catch {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}
//TODO : pagination by scrole
exports.getAllActiveOrder = async (req, res) => {
  try {
    const orders = await Order.find({ state: status.active })
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
    return res.status(500).send({ message: messages.errorMessage })
  }
}

exports.getCompanyOrders = async (req, res) => {
  try {
    const _id = req.params.id
    const company = await Company.findOne({ _id })
    if (`${company._id}` !== req.userData.id) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    const type =
      req.query.type === 'all'
        ? { $in: [status.active, status.pending, status.done] }
        : req.query.type

    const orders = await Order.find({ companyId: _id, state: type })
      .select('state points order_description take_address deliver_address order_start_time receiver_name receiver_phone comment userId')

    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const user = await Users.findOne({ _id: orders[i]._doc.userId })
      const order = {
        id: orders[i]._doc._id,
        ...orders[i]._doc,
        user_name: undefined,
        user_phone: undefined,
        user_email: undefined,
      }
      if (
        orders[i].state === status.done ||
        orders[i].state === status.pending
      ) {
        order.user_name = user ? user.name : 'User has been deleted'
        order.user_phone = user ? user.phone : 'User has been deleted'
        order.user_email = user ? user.email : 'User has been deleted'
      }
      ordersOutput.push(order)
    }
    return res.status(200).send(ordersOutput)
  } catch (err) {
    return res.status(500).send({ message: messages.errorMessage })
  }
}

exports.delOrder = async (req, res) => {
  try {
    const _id = req.params.id
    const { companyId } = await Order.findOne({ _id })
    const company = Company.findOne({ _id: companyId })
    if (`${companyId}` !== `${company._id}`) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    await Order.findByIdAndRemove({
      _id,
    })
    return res.status(202).send({
      message: 'Order deleted',
    })
  } catch (err) {
    return res.status(404).send({ message: messages.errorMessage })
  }
}

exports.updateOrder = async (req, res) => {
  try {
    const _id = req.params.id
    const orderCheck = await Order.findOne({ _id })
    if (
      !orderCheck ||
      (req.body.state === undefined && orderCheck.state === status.pending) ||
      (req.body.state === undefined && orderCheck.state === status.done) ||
      req.body.order_create_time
    ) {
      return res.status(400).send({
        message: messages.errorMessage,
      })
    }

    const order = await Order.findByIdAndUpdate(
      _id,
      { ...req.body },
      { new: true }
    )

    const company = await Company.findOne({ _id: order.companyId })
    const user = await Users.findOne({ _id: order.userId })

    if (order.state === status.pending) {
      sendEmail.sendAcceptOrderEmail(company, user)
    } else if (order.state === status.done) {
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
  } catch {
    return res.status(500).send({ message: messages.errorMessage })
  }
}
//TODO : validate _id
exports.getUserOrders = async (req, res) => {
  const _id = req.params.id
  try {
    const user = await Users.findOne({ _id })
    if (!user) {
      return res.status(400).send({
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
    return res.status(500).send({ message: messages.errorMessage })
  }
}
