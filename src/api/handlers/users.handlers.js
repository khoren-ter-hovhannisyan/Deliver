const Company = require("../models/company.model");
const Users = require("../models/users.model");
const sendEmail = require('../../services/sendEmail')
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({"type":"user"});
    res.json(
      users.map(({ _id, name, lastName, email, phone, address , approved, passportURL,avatar}) => {
          return {
            id: _id,
            name,
            lastName,
            email,
            phone,
            address,
            approved,
            passportURL,
            avatar
        };
      })
    );
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.getUserById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const { _id, name, lastName, email, phone, address , avatar} = await Users.findOne({
      _id
    });
    res.json({
      id: _id,
      name,
      lastName,
      email,
      phone,
      address,
      avatar
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.createUser = (req, res) => {
  console.log(req.body)
  Company.find({ email: req.body.email }).then(company => {
    if (company.length >= 1) {
      return res.status(409).json({
        message: "Mail exists"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return status(500).json({
            error: err
          });
        } else {
          const user = new Users({
            ...req.body,
            approved:false,
            type:"user",
            password: hash,
            avatar
          });
          user.save(function(err, user) {
            if (err) {
              return res.status(500).json(err);
            }
            sendEmail.sendInfoSignUp(user)
            sendEmail.sendWaitEmailForReceiver(user)
            res.status(201).json({
              message: "Deliverer created"
            });
          });
        }
      });
    }
  });
};


exports.delUser = async (req, res) => {
  const _id = req.params.id;
  try { 
    await Users.findByIdAndRemove({ _id });
    res.json({
      message:"Deliverer deleted"
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id: _id } = req.params;
  try {
    await Users.findByIdAndUpdate(
      _id,
      { ...req.body },
      {
        new: true
      }
    );
    res.json({
      id: _id,
      name,
      lastName,
      email,
      phone,
      address,
      approved,
      passportURL
    });
  } catch (err) {
    res.status(404).send(err);
  }
};


