const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Company = require('../models/company.model')
const Users = require('../models/users.model')

const { generateToken } = require('../middleware/generateToken.middleware')

exports.login = async (req, res) => {
  try {
    const company = await Company.findOne({
      email: req.body.email.toLowerCase(),
    })
    const user = await Users.findOne({
      email: req.body.email.toLowerCase(),
      type: 'user',
    })
    //TODO: sarqel bolor str-ner-i hamar constantner
    if (company) {
      if (company.approved === 'pending') {
        return res.status(406).send({
          message:
            'Our admin team is reviewing your sign up request. Please wait for the response!',
        })
      } else if (company.approved === 'declined') {
        return res.status(406).send({
          message:
            'Your sign-up request has unfortunately been declined. Please contact our administration for more information.',
        })
      }
      bcrypt.compare(req.body.password, company.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: 'Auth failed',
          })
        }
        if (result) {
          //TODO: tokenner@ set anel cookineri mej , expires time qcel configneri mej, uxarkel headers-ov

          generateToken(res, company._id)
          return res.status(200).send({
            id: company._id,
            type: company.type,
            message: 'Auth successful',
          })
        }
        return res.status(401).send({
          message: 'Auth failed',
        })
      })
    } else if (user) {
      if (user.approved === 'pending') {
        return res.status(406).send({
          message:
            'Our admin team is reviewing your sign up request. Please wait for the response!',
        })
      } else if (user.approved === 'declined') {
        return res.status(406).send({
          message:
            'Your sign-up request has unfortunately been declined. Please contact our administration for more information.',
        })
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: 'Auth failed',
          })
        }
        if (result) {
          generateToken(res, user._id)
          return res.status(200).send({
            id: user._id,
            type: user.type,
            message: 'Auth successful',
          })
        }
        return res.status(401).send({
          message: 'Auth failed',
        })
      })
    } else {
      return res
        .status(400)
        .send({ message: 'Current password or email does not match' })
    }
  } catch (err) {
    return res.status(500).send({ message: 'Something went wrong' })
  }
}
exports.loginAdmin = (req, res) => {
  Users.findOne({ email: req.body.email.toLowerCase(), type: 'admin' })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: 'Auth failed: email or password is incorrect',
        })
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: 'Auth failed: email or password is incorrect',
          })
        }
        if (result) {
          generateToken(res, user._id)
          return res.status(200).send({
            type: user.type,
            token,
            message: 'Auth successful',
          })
        }
        return res.status(401).send({
          message: 'Auth failed: email or password is incorrect',
        })
      })
    })
    .catch(_ => {
      return res.status(401).send({
        message: 'Auth failed: email or password is incorrect',
      })
    })
}
