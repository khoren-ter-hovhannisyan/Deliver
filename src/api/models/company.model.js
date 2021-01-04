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
    default: 'panding'
  },
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217691/uy4ik67icwc2a9rmabnn.png',
  },
})

module.exports = model('Company', companySchema)
