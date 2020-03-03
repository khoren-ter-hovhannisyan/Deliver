const Company = require('../models/company.model')
const Users = require('../models/users.model')
const sendEmail = require('../../services/sendEmail')
const bcrypt = require('bcrypt')

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
    res.json(
      companies.map(
        ({
          _id,
          activity,
          address,
          taxNumber,
          phone,
          email,
          name,
          approved,
          orders,
          avatar,
        }) => {
          return {
            id: _id,
            name,
            email,
            phone,
            taxNumber,
            address,
            activity,
            approved,
            avatar,
            orders,
          }
        }
      )
    )
  } catch (err) {
    res.status(404).send(err)
  }
}

exports.getCompanyById = async (req, res) => {
  const {
    id: _id
  } = req.params
  try {
    const {
      _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity,
      avatar,
    } = await Company.findOne({
      _id
    })
    res.json({
      id: _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity,
      avatar,
    })
  } catch (err) {
    res.status(404).send(err)
  }
}

exports.createCompany = (req, res, next) => {
  console.log(req.body)
  Users.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: 'Mail exists',
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: 'Something went bad',
            })
          } else {
            const company = new Company({
              ...req.body,
              type: 'company',
              password: hash,
            })

            company.save(function (err, company) {
              if (err) {
                return res.status(400).json({
                  error: 'Some input field is wrong or is not exist',
                  message: err,
                })
              }
              sendEmail.sendInfoSignUp(company)
              sendEmail.sendWaitEmailForReceiver(company)
              res.status(201).json({
                message: 'Company created',
              })
            })
          }
        })
      }
    })
    .catch(err => {
      console.log(err)
      return res.status(400).send('')
    })
}

exports.delCompany = async (req, res) => {
  const _id = req.params.id
  try {
    await Company.findByIdAndRemove({
      _id
    })
    res.json({
      msg: 'company is deleted',
    })
  } catch (err) {
    res.status(404).send(err)
  }
}

exports.updateCompany = async (req, res) => {
  const _id = req.params.id
  try {
    const company = await Company.findByIdAndUpdate(
      _id, {
        ...req.body
      }, {
        new: true,
      }
    )
    res.status(201).send({
      id: _id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      taxNumber: company.taxNumber,
      address: company.address,
      activity: company.activity,
      approved: company.approved,
      avatar: company.avatar,
    })
  } catch (err) {
    res.status(404).send(err)
  }
}