const Company = require("../models/company.model");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(
      companies.map(({ _id, activity, address, taxNumber, phone, email, name }) => {
        return {
          id: _id,
          name,
          email,
          phone,
          taxNumber,
          address,
          activity
        };
      })
    );
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.getCompanyById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const {
      _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity
    } = await Company.findOne({ _id });
    res.json({
      id: _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.createCompany = (req, res, next) => {
  console.log(req.body);
  Users.findOne({ email: req.body.email,taxNumber:req.body.taxNumber})
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: "Something went bad"
            });
          } else {
            const company = new Company({
              ...req.body,
              approved:false,
              password: hash
            });

            company.save(function(err, company) {
              if (err) {
                return res.status(500).json({
                  error: "Some input field is wrong or is not exist",
                  message:err
                });
              }
              res.status(201).json({
                data: {
                  id: company._id,
                  name: company.name,
                  taxNumber: company.taxNumber,
                  address: company.address,
                  activity:company.activity,
                  phone: company.phone
                },
                message: "Company created"
              });
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send("");
    });
};

exports.loginCompany = (req, res, next) => {
  console.log(req.body);
  Company.findOne({ email: req.body.email })
    .then(company => {
      console.log(company)
      if (!company) {
        return res.status(401).json({
          message: "Auth failed"
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
              userId: company._id
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
              phone: company.phone
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
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delCompany = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const {
      _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity
    } = await Company.findByIdAndRemove({ _id });
    res.json({
      id: _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.updateCompany = async (req, res) => {
  const { id: _id } = req.body;
  try {
    const {
      _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity
    } = await Company.findByIdAndUpdate(
      _id,
      { ...req.body },
      {
        new: true
      }
    );
    res.json({
      id: _id,
      name,
      email,
      phone,
      taxNumber,
      address,
      activity
    });
  } catch (err) {
    res.status(404).send(err);
  }
};
