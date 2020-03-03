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

exports.getAllActiveOrder = (req, res) => {
  Order.find({ state: 'active' }).then(orders => {
    const items = orders.map(item => {
      const order = {
        id: item._id,
        state: item.state,
        points: item.points,
        order_description: item.order_description,
        take_adress: item.take_adress,
        deliver_address: item.deliver_address,
        order_create_time: item.order_create_time,
        order_start_time: item.order_start_time,
        order_end_time: item.order_end_time,
        comment: item.comment,
      }
    const r = await Company.findById({ _id: item.companyId }).then(res => res)
    console.log(r.name, r.phone);
        // const i = async () => {
        //     const order = {
        //         id: item._id,
        //         state: item.state,
        //         points: item.points,
        //         order_description: item.order_description,
        //         take_adress: item.take_adress,
        //         deliver_address: item.deliver_address,
        //         order_create_time: item.order_create_time,
        //         order_start_time: item.order_start_time,
        //         order_end_time: item.order_end_time,
        //         comment: item.comment,
        //     }
        //     const r = await Company.findById({ _id: item.companyId }).then(res => res)
        //     console.log(r.name, r.phone);
        //     return order
            
        // }
        // console.log(i().then(res=>res));
        
        
        
        return order
    })
    return res.status(201).send(items)
  })
}
