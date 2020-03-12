const bcrypt = require('bcrypt')

const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')
const sendEmail = require('../../services/sendEmail')

const { types, status, messages, selectTypes } = require('../../utils/constans')

exports.getAllUsers = async (req, res) => {
  try {
    const last = Number(req.query.last)
    const count = Number(req.query.count) + 1
    const users = await Users.find({
      type: types.user,
    })
      .sort({ createdTime: -1 })
      .where('createdTime')
      .lt(last)
      .limit(count)
      .select(selectTypes.userGetAll)
    if (users.length === 0) {
      return res.status(206).send({
        message: messages.errorNoContent,
      })
    }
    const usersOutput = []
    for (let i = 0; i < users.length; i++) {
      const user = {
        id: users[i]._id,
        ...users[i]._doc,
      }
      usersOutput.push(user)
    }
    return res.status(200).send(usersOutput)
  } catch (err) {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}
//TODO : mongoose selectorrneric ogtvel
exports.getUserById = async (req, res) => {
  const _id = req.params.id
  try {
    const user = await Users.findOne({
      _id,
    }).select(selectTypes.userGetbyId)
    return res.status(200).send({
      id: user._id,
      ...user._doc,
    })
  } catch (err) {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    const company = await Company.findOne({
      email: req.body.email.toLowerCase(),
    })
    const user = await Users.findOne({
      email: req.body.email.toLowerCase(),
    })
    if (!company && !user) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return status(500).send({
            message: messages.errorMessage,
          })
        } else {
          const user = new Users({
            ...req.body,
            email: req.body.email.toLowerCase(),
            password: hash,
          })

          user.save((err, user) => {
            if (err) {
              return res.status(500).send({
                message: messages.errorMessage,
              })
            }
            sendEmail.sendInfoSignUp(user)
            sendEmail.sendWaitEmailForReceiver(user)
            res.status(201).send({
              message: messages.successCreatedMessage,
            })
          })
        }
      })
    } else {
      return res.status(406).send({
        message: messages.errorAlreadyExists,
      })
    }
  } catch {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}

exports.delUser = async (req, res) => {
  try {
    const _id = req.params.id
    await Users.findByIdAndRemove({
      _id,
    })
    res.status(202).send({
      message: messages.successDeletedMessage,
    })
  } catch {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}

exports.updateUser = async (req, res) => {
  const _id = req.params.id
  try {
    const userCheck = await Users.findOne({
      _id,
    })
    if (
      req.body.approved === status.accepted &&
      userCheck.approved !== status.accepted
    ) {
      sendEmail.sendAcceptEmail(userCheck)
    } else if (
      req.body.approved === status.declined &&
      userCheck.approved !== status.declined
    ) {
      sendEmail.sendDeclineEmail(userCheck)
    }

    if (req.body.old_password && req.body.new_password) {
      bcrypt.compare(
        req.body.old_password,
        userCheck.password,
        (err, result) => {
          if (err || !result) {
            return res.status(401).send({
              message: messages.errorOldPasswordMessage,
            })
          }
          bcrypt.hash(req.body.new_password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                message: messages.errorMessage,
              })
            } else {
              Users.findByIdAndUpdate(
                _id,
                {
                  ...req.body,
                  password: hash,
                },
                {
                  new: true,
                }
              ).then(user => {
                return res.status(201).send({
                  id: user._id,
                  name: user.name,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone,
                  address: user.address,
                  approved: user.approved,
                  passportURL: user.passportURL,
                  avatar: user.avatar,
                  amount: user.amount,
                  rating: user.rating,
                  createdTime: user.createdTime,
                })
              })
            }
          })
        }
      )
    }
    const user = await Users.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    )
    return res.status(201).send({
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      approved: user.approved,
      passportURL: user.passportURL,
      avatar: user.avatar,
      amount: user.amount,
      rating: user.rating,
      createdTime: user.createdTime,
    })
  } catch {
    return res.status(500).send({
      message: message.errorMessage,
    })
  }
}
