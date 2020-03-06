const { Schema, model } = require('mongoose')

const usersSchema = new Schema({
  type: {
    type: String,
    default: 'user',
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
    default: 'pending',
  },
  passportURL: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217677/q608defvqrdhobxrjhw1.png',
  },
  amount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
})

module.exports = model('User', usersSchema)
