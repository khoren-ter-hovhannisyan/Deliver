const Company = require("../models/company.model");
const Users = require("../models/users.model");
const sendEmail = require('../../services/sendEmail')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({"type":"user"});
    res.json(
      users.map(({ _id, name, lastName, email, phone, address , type}) => {
          return {
            id: _id,
            name,
            lastName,
            email,
            phone,
            address
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
    const { _id, name, lastName, email, phone, address } = await Users.findOne({
      _id
    });
    res.json({
      id: _id,
      name,
      lastName,
      email,
      phone,
      address
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
            password: hash
          });
          user.save(function(err, user) {
            if (err) {
              return res.status(500).json(err);
            }
            sendEmail.sendInfoSignUp(user)
            res.status(201).json({
              message: "Deliverer created"
            });
          });
        }
      });
    }
  });
};

exports.loginUser = (req, res, next) => {
  Users.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed: email or paswword is incorrect"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed: email or password is incorrect"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "12h"
            }
          );
          return res.status(200).json({
            data: {
              id: user._id,
              name: user.name,
              lastName: user.lastName,
              address: user.address,
              phone: user.phone,
              type:user.type
            },
            token: token,
            message: "Auth successful"
          });
        }
        res.status(401).json({
          message: "Auth failed: email or password is incorrect"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delUser = async (req, res) => {
  const { id: _id } = req.body;
  try { 
    const { 
      _id, 
    } = await Users.findByIdAndRemove({ _id });
    res.json({
      message : "Deliverer deleted"
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id: _id } = req.body;
  try {
    const {
      _id,
      name,
      lastName,
      email,
      phone,
      address
    } = await Users.findByIdAndUpdate(
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
      address
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.loginAdmin = (req, res) => {
  Users.findOne({ email: req.body.email , type:"admin"})
    .then(user => {
      console.log(user.email)
      if (!user) {
        return res.status(401).json({
          message: "Auth failed: email or password is incorrect"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed: email or password is incorrect"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "12h"
            }
          );
          return res.status(200).json({
            data: {
              type: user.type
            },
            token: token,
            message: "Auth successful"
          });
        }
        res.status(401).json({
          message: "Auth failed: email or password is incorrect"
        });
      });
    })
    .catch( _ => {
      res.status(400).json({
        message: "Auth failed: email or password is incorrect"
      });
    });
}
