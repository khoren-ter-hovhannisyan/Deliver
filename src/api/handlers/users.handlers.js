const bcrypt = require('bcrypt')

const Company = require('../models/company.model')
const Users = require('../models/users.model')
const Order = require('../models/order.model')
const sendEmail = require('../../services/sendEmail')

exports.getAllUsers = async (req, res) => {
  try {
    console.log(req.query.last,"*****", Number(req.query.last));
    console.log(req.query.count,"*****", Number(req.query.count));
    const users = await Users.find({
      type: 'user',
      createdTime :{$lt: Number(req.query.last)}
    }).limit(Number(req.query.count))
    console.log(users);
    
    const usersOutput = []
    for (let i = 0; i < users.length; i++) {
      const orders_count = await Order.find({
        userId: users[i]._id,
        state: 'pending',
      })
      const user = {
        id: users[i]._id,
        name: users[i].name,
        lastName: users[i].lastName,
        email: users[i].email,
        phone: users[i].phone,
        address: users[i].address,
        type: users[i].type,
        approved: users[i].approved,
        passportURL: users[i].passportURL,
        avatar: users[i].avatar,
        amount: users[i].amount,
        rating: users[i].rating,
        createdTime: users[i].createdTime,
        orders_count: orders_count.length,
      }
      usersOutput.push(user)
    }
    return res.status(200).send(usersOutput)
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}
//TODO : mongoose selectorrneric ogtvel 
exports.getUserById = async (req, res) => {
  const _id = req.params.id
  try {
    const user = await Users.findOne({
      _id,
    })
    return res.status(200).send({
      id: user._id,
      name: user.name,
      lastName: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      type: user.type,
      approved: user.approved,
      passportURL: user.passportURL,
      avatar: user.avatar,
      amount: user.amout,
      rating: user.rating,
      createdTime: user.createdTime,
    })
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    const company = await Company.findOne({
      email: req.body.email.toLowerCase(),
    })
    const user = await Users.findOne({ email: req.body.email.toLowerCase() })
    if (!company && !user) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return status(500).send({
            message: 'Something went wrong, try later',
            error: err,
          })
        } else {
          const user = new Users({
            ...req.body,
            email: req.body.email.toLowerCase(),
            type: 'user',
            password: hash,
          })

          user.save(function(err, user) {
            if (err) {
              return res
                .status(500)
                .send({ message: 'Something went wrong, try later', err })
            }
            sendEmail.sendInfoSignUp(user)
            sendEmail.sendWaitEmailForReceiver(user)
            res.status(201).send({
              message: 'Deliverer created',
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

exports.delUser = async (req, res) => {
  const _id = req.params.id
  try {
    await Users.findByIdAndRemove({
      _id,
    })
    res.status(202).send({
      message: 'Deliverer deleted',
    })
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}

exports.updateUser = async (req, res) => {
  const _id = req.params.id
  try {
    const userCheck = await Users.findOne({
      _id,
    })
    if (req.body.approved === 'accepted' && userCheck.approved !== 'accepted') {
      sendEmail.sendAcceptEmail(userCheck)
    } else if (
      req.body.approved === 'declined' &&
      userCheck.approved !== 'declined'
    ) {
      sendEmail.sendDeclineEmail(userCheck)
    }

    if (req.body.old_password && req.body.new_password) {
      bcrypt.compare(
        req.body.old_password,
        userCheck.password,
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
          return res.status(401).send({
            message: 'Auth failed: email or password is incorrect',
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
  } catch (err) {
    return res.status(500).send({
      message: 'Something went wrong, try later',
      err,
    })
  }
}



