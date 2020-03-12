const { Schema, model } = require('mongoose')

const { types, status, img } = require('../../utils/constans')

const companySchema = new Schema({
  type: {
    type: String,
    default: types.company,
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
    default: status.pending,
  },
  avatar: {
    type: String,
    default: img.companyAvatar,
  },
  amount: {
    type: Number,
    default: 0,
  },
  createdTime: {
    type: Number,
    default: () => Number(Date.now()),
  },
})

module.exports = model('Company', companySchema)
