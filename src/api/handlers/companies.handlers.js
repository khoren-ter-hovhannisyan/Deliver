const bcrypt = require('bcrypt')

const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')

const sendEmail = require('../../services/sendEmail')

const { types, status, messages } = require('../../utils/constans')

// TODO: sarqel pagination-ov

exports.getAllCompanies = async (req, res) => {
  try {
    const admin = await Users.findOne({ type: types.admin })
    console.log(typeof admin._id, typeof req.userData.id)
    console.log(req.userData.id, admin._id)

    console.log(req.userData.id !== admin._id)

    // if (req.userData.id !== admin._id) {
    //   return res.status(401).send({
    //     message: messages.errorMessage,
    //   })
    // }
    const companies = await Company.find({})
    const companiesOutput = []
    for (let i = 0; i < companies.length; i++) {
      const company_orders_count = await Order.find({
        companyId: companies[i]._id,
      })
      const company = {
        id: companies[i]._id,
        name: companies[i].name,
        email: companies[i].email,
        phone: companies[i].phone,
        taxNumber: companies[i].taxNumber,
        address: companies[i].address,
        activity: companies[i].activity,
        approved: companies[i].approved,
        avatar: companies[i].avatar,
        amount: companies[i].amount,
        createdTime: Date.parse(companies[i].createdTime),
        orders_count: company_orders_count.length,
      }
      companiesOutput.push(company)
    }
    return res.status(200).send(companiesOutput)
  } catch (err) {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}

//TODO: data restiction

exports.getCompanyById = async (req, res) => {
  try {
    const _id = req.params.id
    if (req.userData.id !== _id) {
      return res.status(401).send({
        message: messages.errorMessage,
      })
    }
    const company = await Company.findOne({ _id })
    return res.status(200).send({
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
      message: messages.errorMessage,
    })
  }
}
/////// EEEEror
exports.createCompany = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email.toLowerCase() })
    const company = await Company.findOne({
      email: req.body.email.toLowerCase(),
    })

    if (!user && !company) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            message: messages.errorMessage,
          })
        } else {
          const company = new Company({
            ...req.body,
            email: req.body.email.toLowerCase(),
            password: hash,
          })

          company.save((err, company) => {
            if (err) {
              return res.status(400).send({
                message: 'Some input fields are wrong or empty',
              })
            }
            sendEmail.sendInfoSignUp(company)
            sendEmail.sendWaitEmailForReceiver(company)
            return res.status(201).send({
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
    return res.status(500).send({ message: messages.errorMessage })
  }
}

exports.delCompany = async (req, res) => {
  try {
    const _id = req.params.id
    const adminId = await Users.findOne({ type: types.admin })
    const companyId = await Company.findOne({ _id })
    
    
    
    if (
      !(
        req.userData.id === JSON.stringify(adminId._id) ||
        req.userData.id === `${companyId._id}`
      )
    ) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    const order = await Order.findOne({ companyId: _id })
    const pendingOrder = await Order.findOne({
      companyId: _id,
      state: status.pending,
    })
    if (pendingOrder) {
      return res.status(401).send({
        message:
          'The company cannot be deleted. The company has pending order(s)!',
      })
    }
    if (order) {
      await Order.remove({ companyId: _id })
    }
    await Company.findByIdAndRemove({ _id })
    return res.status(202).send({
      message: 'Company is deleted',
    })
  } catch {
    return res.status(500).send({ message: messages.errorMessage })
  }
}

exports.updateCompany = async (req, res) => {
  try {
    if (req.body.createdTime) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    const _id = req.params.id
    const companyCheck = await Company.findOne({ _id })
    const adminId = await Users.findOne({ type: types.admin })
    console.log(`${companyCheck._id}`, JSON.stringify(companyCheck._id));
    
    console.log(typeof (`${companyCheck._id}`));
    console.log(typeof(JSON.stringify(companyCheck._id)));
    if (
      !(req.userData.id === `${companyCheck._id}` || req.userData.id === JSON.stringify( companyCheck._id))
    ) {
      return res.status(500).send({ message: messages.errorMessage })
    }
    if (
      req.body.approved === status.accepted &&
      companyCheck.approved !== status.accepted
    ) {
      sendEmail.sendAcceptEmail(companyCheck)
    } else if (
      req.body.approved === status.declined &&
      companyCheck.approved !== status.declined
    ) {
      sendEmail.sendDeclineEmail(companyCheck)
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
                  message: messages.errorMessage,
                })
              }
              Company.findByIdAndUpdate(
                _id,
                {
                  password: hash,
                },
                {
                  new: true,
                }
              )
            })
          }
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
  } catch {
    return res.status(500).send({
      message: messages.errorMessage,
    })
  }
}
