const moment = require('moment')

const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')

const sendEmail = require('../../services/sendEmail')

const { types, status, messages, selectTypes } = require('../../utils/constans')

exports.createOrder = async (req, res) => {
  try {
    const { companyId, order } = req.body
    const company = await Company.findOne({ _id: companyId })
    if (`${companyId}` !== `${req.userData.id}`) {
      return res.status(500).send({ message: messages.errorMessage })
    }

    if (Number(order.points) > Number(company.amount)) {
      return res
        .status(400)
        .send({ message: 'You can`t cratea order , you have no enough mony' })
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
    const orders = await Order.find({ state: status.active }).select(
      selectTypes.orderForActiveOrders
    )
    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const company = await Company.findOne({ _id: orders[0]._doc.companyId })
      const order = {
        id: orders[i]._doc._id,
        ...orders[i]._doc,
        order_start_time: moment(orders[i]._doc.order_start_time).format('L'),
        order_end_time: moment(orders[i]._doc.order_end_time).format('L'),
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

    const orders = await Order.find({ companyId: _id, state: type }).select(
      selectTypes.orderForCompanies
    )

    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const user = await Users.findOne({ _id: orders[i]._doc.userId })
      const order = {
        id: orders[i]._doc._id,
        ...orders[i]._doc,
        order_start_time: moment(orders[i]._doc.order_start_time).format('L'),
        order_end_time: moment(orders[i]._doc.order_end_time).format('L'),
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
    const company = await Company.findOne({ _id: req.userData.id })
    if (
      !orderCheck ||
      (req.body.state === undefined && orderCheck.state === status.pending) ||
      (req.body.state === undefined && orderCheck.state === status.done) ||
      req.body.order_create_time
    ) {
      if (
        orderCheck &&
        company &&
        orderCheck.state === status.done &&
        req.body.rating
      ) {
        
        const order = await Order.findByIdAndUpdate(
          _id,
          { rating: req.body.rating },
          { new: true }
        )

        const { rating } = await Users.findOne({ _id: order.userId })
        rating.push(req.body.rating)

        await Users.findByIdAndUpdate(
          { _id: order.userId },
          { rating },
          { new: true }
        )
        return res.status(200).send({ message: 'Order has been ratied' })
      } else {
        return res.status(400).send({
          message: messages.errorMessage,
        })
      }
    } else {
      const order = await Order.findByIdAndUpdate(
        _id,
        { ...req.body },
        { new: true }
      ).select(selectTypes.orderForUpdate)

      const user = await Users.findOne({ _id: order.userId })

      if (order._doc.state === status.pending) {
        sendEmail.sendAcceptOrderEmail(company, user)
      } else if (order._doc.state === status.done) {
        await Company.findByIdAndUpdate(
          company._id,
          { amount: company.amount - order._doc.points },
          { new: true }
        )

        await user.findByIdAndUpdate(
          user._id,
          { amount: user.amount + order._doc.amount },
          { new: true }
        )

        sendEmail.sendDoneOrderEmail(company, user)
      }

      return res.status(201).send({ message: 'Order updated' })
    }
  } catch {
    return res.status(500).send({ message: messages.errorMessage })
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    const _id = req.params.id
    const user = await Users.findOne({ _id })

    if (req.userData.id !== `${user._id}`) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    if (!user) {
      return res.status(400).send({
        message: 'There is no such user',
      })
    }

    const orders = await Order.find({ userId: _id }).select(
      selectTypes.orderForUser
    )
    const ordersOutput = []

    for (let i = 0; i < orders.length; i++) {
      const company = await Company.findOne({ _id: orders[i].companyId })
      const order = {
        id: orders[i]._doc._id,
        ...orders[i]._doc,
        order_start_time: moment(orders[i]._doc.order_start_time).format('L'),
        order_end_time: moment(orders[i]._doc.order_end_time).format('L'),
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
