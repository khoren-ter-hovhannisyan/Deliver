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
      id: company._id,
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

exports.createCompany = async (req, res) => {
  try {
    const user = findOne({ email: req.body.email.toLowerCase() })
    const company = findOne({ email: req.body.email.toLowerCase() })
    if (!user && !company) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            error: 'Something went wrong, try later',
          })
        } else {
          const company = new Company({
            ...req.body,
            email: req.body.email.toLowerCase(),
            type: 'company',
            password: hash,
          })

          company.save(function(err, company) {
            if (err) {
              console.log(err)

              return res.status(400).send({
                message: 'Some input fields are wrong or empty',
                error: err,
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
    } else {
      return res.status(406).send({
        message: 'Email already exists',
      })
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong, try later', err })
  }
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
    const companyCheck = await Company.findOne({
      _id,
    })
    if (
      req.body.approved === 'accepted' &&
      companyCheck.approved !== 'accepted'
    ) {
      sendEmail.sendAcceptEmail(companyCheck)
    } else if (
      req.body.approved === 'declined' &&
      companyCheck.approved !== 'declined'
    ) {
      sendEmail.sendDeclineEmail(companyCheck)
    }

    if (req.body.email) {
      return res.status(400).send({
        message: 'cant change email',
      })
    }

    if (req.body.old_password && req.body.new_password) {
      bcrypt.compare(
        req.body.old_password,
        companyCheck.password,
        (err, result) => {
          if (err) {
            return res.status(401).send({
              message: 'Old password is incorrect',
            })
          }
          if (result) {
            bcrypt.hash(req.body.new_password, 10, (err, hash) => {
              if (err) {
                return res.status(500).send({
                  error: 'Something went wrong, try later',
                })
              } else {
                Company.findByIdAndUpdate(
                  _id,
                  {
                    ...req.body,
                    password: hash,
                  },
                  {
                    new: true,
                  }
                ).then(company => {
                  return res.status(201).send({
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
                })
              }
            })
          }
          return res.status(401).send({
            message: 'Auth failed: email or password is incorrect',
          })
        }
      )
    }

    const company = await Company.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    )
    return res.status(201).send({
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
