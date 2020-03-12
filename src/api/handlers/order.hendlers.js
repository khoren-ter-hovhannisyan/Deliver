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
    console.log(!((`${company._id}` === `${companyId}`) === `${req.userData.id}`))
    console.log(`${company._id}`, companyId, req.userData.id)

    if (!((`${company._id}` === `${companyId}`) === `${req.userData.id}`)) {
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
    const orders = await Order.find({ state: status.active }).select(
      selectTypes.orderForActiveOrders
    )
    const ordersOutput = []
    for (let i = 0; i < orders.length; i++) {
      const company = await Company.findOne({ _id: orders[0]._doc.companyId })
      const order = {
        id: orders[i]._doc._id,
        ...orders[i]._doc,
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
    ).select(selectTypes.orderForUpdate)

    const company = await Company.findOne({ _id: order.companyId })
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

    return res.status(201).send({
      id: order._doc._id,
      ...order._doc,
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
