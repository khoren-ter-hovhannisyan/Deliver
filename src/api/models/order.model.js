const { Schema, model } = require('mongoose')

const { status } = require('../../utils/constans')

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
    required: true,
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
    default: status.active,
  },
  companyId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  receiver_name: {
    type: String,
    required: true,
  },
  receiver_phone: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
  },
})

module.exports = model('Order', orderSchema)
