const { Schema, model } = require('mongoose')

const companySchema = new Schema({
  type: {
    type: String,
    default: 'company',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  taxNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  approved: {
    type: String,
    default: 'pending',
  },
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217691/uy4ik67icwc2a9rmabnn.png',
  },
  amount: {
    type: Number,
    default: 0,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },
})

module.exports = model('Company', companySchema)
