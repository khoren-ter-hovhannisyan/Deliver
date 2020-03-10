const bcrypt = require('bcrypt')

const Company = require('../models/company.model')
const Users = require('../models/users.model')

const { generateToken } = require('../middleware/generateToken.middleware')
const { types, status, messages } = require('../../utils/constans')

exports.login = async (req, res) => {
  try {
    const company = await Company.findOne({
      email: req.body.email.toLowerCase(),
    })
    const user = await Users.findOne({
      email: req.body.email.toLowerCase(),
      type: types.user,
    })
    if (company) {
      if (company.approved === status.pending) {
        return res.status(406).send({
          message: messages.errorPendingMessage,
        })
      } else if (company.approved === status.declined) {
        return res.status(406).send({
          message: messages.errorDeclinedMessage,
        })
      }
      bcrypt.compare(req.body.password, company.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: messages.errorAuthfailed,
          })
        }
        if (result) {
          generateToken(res, company._id)
          return res.status(200).send({
            id: company._id,
            type: company.type,
            message: messages.succsessAuthMessage,
          })
        }
        return res.status(401).send({
          message: messages.errorAuthfailed,
        })
      })
    } else if (user) {
      if (user.approved === status.pending) {
        return res.status(406).send({
          message: messages.errorPendingMessage,
        })
      } else if (user.approved === status.declined) {
        return res.status(406).send({
          message: messages.errorDeclinedMessage,
        })
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: messages.errorAuthfailed,
          })
        }
        if (result) {
          generateToken(res, user._id)
          return res.status(200).send({
            id: user._id,
            type: user.type,
            message: messages.succsessAuthMessage,
          })
        }
        return res.status(401).send({
          message: messages.errorAuthfailed,
        })
      })
    } else {
      return res.status(401).send({ message: messages.errorAuthfailed })
    }
  } catch (err) {
    return res.status(500).send({ message: messages.errorMessage })
  }
}
exports.loginAdmin = (req, res) => {
  Users.findOne({ email: req.body.email.toLowerCase(), type: types.admin })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: messages.errorAuthfailed,
        })
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: messages.errorAuthfailed,
          })
        }
        if (result) {
          generateToken(res, user._id)
          return res.status(200).send({
            type: user.type,
            message: messages.succsessAuthMessage,
          })
        }
        return res.status(401).send({
          message: messages.errorAuthfailed,
        })
      })
    })
    .catch(_ => {
      return res.status(401).send({
        message: messages.errorAuthfailed,
      })
    })
}
