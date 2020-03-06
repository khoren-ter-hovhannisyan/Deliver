const Company = require('../models/company.model')
const Users = require('../models/users.model')
const sendEmail = require('../../services/sendEmail')
const bcrypt = require('bcrypt')

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
    res.status(200).send(
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
          avatar,
          amount,
          createdTime,
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
            amount,
            createdTime: Date.parse(createdTime),
          }
        }
      )
    )
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}

exports.getCompanyById = async (req, res) => {
  const _id = req.params.id
  try {
    const company = await Company.findOne({
      _id,
    })
    res.status(200).send({
      id: company_id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      taxNumber: company.taxNumber,
      address: company.address,
      approved: company.approved,
      activity: company.activity,
      avatar: company.avatar,
      amount: company.amount,
      createdTime: Date.parse(company.createdTime),
    })
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}

exports.createCompany = (req, res, next) => {
  console.log(req.body)
  Users.findOne({
    email: req.body.email,
  })
    .then(user => {
      if (user) {
        return res.status(406).send({
          message: 'Mail exists',
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              error: 'Something went wrong, try later',
            })
          } else {
            const company = new Company({
              ...req.body,
              type: 'company',
              password: hash,
            })

            company.save(function(err, company) {
              if (err) {
                return res.status(400).send({
                  error: 'Some input fields are wrong or empty',
                  message: err,
                })
              }
              sendEmail.sendInfoSignUp(company)
              sendEmail.sendWaitEmailForReceiver(company)
              res.status(201).send({
                message: 'Company created',
              })
            })
          }
        })
      }
    })
    .catch(err => {
      return res
        .status(500)
        .send({ message: 'Something went wrong, try later' })
    })
}

exports.delCompany = async (req, res) => {
  const _id = req.params.id
  try {
    await Company.findByIdAndRemove({
      _id,
    })
    res.status(202).send({
      message: 'Company is deleted',
    })
  } catch (err) {
    res.status(500).send({ message: 'Something went wrong, try later', err })
  }
}

exports.updateCompany = async (req, res) => {
  const _id = req.params.id
  try {
    const company = await Company.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    )
    if (company.approved === 'accepted') {
      sendEmail.sendAcceptEmail(company)
    } else if (company.approved === 'declined') {
      sendEmail.sendDeclineEmail(company)
    }
    res.status(201).send({
      id: company._id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      taxNumber: company.taxNumber,
      address: company.address,
      activity: company.activity,
      approved: company.approved,
      avatar: company.avatar,
      amount: company.amount,
      createdTime: Date.parse(company.createdTime),
    })
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}
