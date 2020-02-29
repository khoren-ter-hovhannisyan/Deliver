const Company = require("../models/company.model");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  Company.findOne({ email: req.body.email })
    .then(company => {
      if (!company) {
        Users.findOne({ email: req.body.email }).then(user => {
          if (!user) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return res.status(401).json({
                message: "Auth failed"
              });
            }
            if(result){
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
                  type: user.type,
                  email: user.email
                },
                token: token,
                message: "Auth successful"
              });
            }
            res.status(401).json({
              message: "Auth failed"
            });
          });
        });
      }
      bcrypt.compare(req.body.password, company.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: company.email,
              companyId: company._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "12h"
            }
          );
          return res.status(200).json({
            data: {
              id: company._id,
              name: company.name,
              taxNumber: company.taxNumber,
              address: company.address,
              phone: company.phone,
              email: company.email
            },
            token: token,
            message: "Auth successful"
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
};
exports.loginAdmin = (req, res) => {
  Users.findOne({ email: req.body.email, type: "admin" })
    .then(user => {
      console.log(user.email);
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
    .catch(_ => {
      res.status(400).json({
        message: "Auth failed: email or password is incorrect"
      });
    });
};