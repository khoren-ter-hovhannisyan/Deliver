const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')

exports.createOrder = (req, res) => {
  const { companyId, order } = req.body

  const newOrder = new Order({
    ...order,
    companyId,
  })

  newOrder.save((err, newOrder) => {
    if (err) {
      return res.status(404).send({
        message: 'Something went wrong, try again in a few minutes',
        err,
      })
    }
    Company.findOne({ _id: newOrder.companyId })
      .then(company => {
        return res.status(201).send({
          id: newOrder._id,
          state: newOrder.state,
          points: newOrder.points,
          order_description: newOrder.order_description,
          take_adress: newOrder.take_adress,
          deliver_address: newOrder.deliver_address,
          order_create_time: newOrder.order_create_time,
          order_start_time: newOrder.order_start_time,
          order_end_time: newOrder.order_end_time,
          comment: newOrder.comment,
          company_name: company.name,
          company_phone: company.phone,
        })
      })
      .catch(err => {
        return res.status(500).send({
          message: 'Something went wrong, try later',
        })
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
        company_name: company.name,
        company_phone: company.phone,
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
        company_name: company.name,
        company_phone: company.phone,
        user_name: user ? user.name : undefined,
        user_phone: user ? user.phone : undefined,
      }
      ordersOutput.push(order)
    }
    return res.status(201).send(ordersOutput)
  } catch (err) {
    return res.status(500).send({ message: 'Something went wron try later' })
  }
}

exports.delOrder = async (req, res) => {
  const _id = req.params
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
