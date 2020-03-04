const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
  points: {
    type: Number,
    required: true,
  },
  take_address: {
    type: String,
    required: true,
  },
  deliver_address: {
    type: String,
    required: true,
  },
  order_description: {
    type: String,
    required: true,
  },
  order_create_time: {
    type: Date,
    default: Date.now,
  },
  order_start_time: {
    type: Date,
    default: Date.now,
  },
  order_end_time: {
    type: Date,
    required: true,
  },
  comment: {
    type: String,
    default: 'No comments',
  },
  state: {
    type: String,
    default: 'active',
  },
  companyId: {
    type: String,
  },
  userId: {
    type: String,
  },
  icon: {
    type: String,
    default:
      'http://res.cloudinary.com/dfeoo5iog/image/upload/v1583318024/sadrnalu7ghnqmgymhca.jpg',
  },
})

module.exports = model('Order', orderSchema)
