const { Schema, model } = require('mongoose')

const { types, status, img } = require('../../utils/constans')

const usersSchema = new Schema({
  type: {
    type: String,
    default: types.user,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
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
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  approved: {
    type: String,
    default: status.pending,
  },
  passportURL: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: img.userAvatar,
  },
  amount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Array,
    default: [],
  },
  createdTime: {
    type: Number,
    default: Number(Date.now()),
  },
})

module.exports = model('User', usersSchema)
