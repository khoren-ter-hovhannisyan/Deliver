const Company = require("../models/company.model");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(
      companies.map(el => {
        return {
          id: el._id,
          name: el.name,
          email: el.email,
          phone: el.phone,
          taxNumber: el.taxNumber ? el.taxNumber : "",
          address: el.address,
          activity: el.activity
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
exports.createCompany = async (req, res, next) => {
  //try {
  await Users.find({ email: req.body.email })
    .exec()
    .then(company => {
      if (company.length>=1) {
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
            const company = new Company({
              _id:new mongoose.Types.ObjectId(),
              email:req.body.email,
              address:req.body.address,
              phone:req.body.phone,
              taxNumber:req.body.taxNumber,
              name:req.body.name,
              password: hash
            });
            company
            .save()
            .then(result => {
              res.status(201).json({
                message: "Company created"
              });
            }).catch(err=>{
              res.status(500)
              console.log("errrrrrr")
            })
            
          }
        });
      }
    });

  //   ,async function (err, results) {

  // }
  //    if (err) { res.status(422).send(err)}
  //    if (!results) {
  //     try{
  //       const newCompany = new Company(req.body) ;
  //       const {_id, name, email, phone, taxNumber, address, activity} = await newCompany.save();
  //       res.json({
  //         id:_id,
  //          name,
  //          email,
  //          phone,
  //          taxNumber,
  //          address,
  //          activity
  //       });
  //     } catch (err) {
  //       res.status(404).send(err);
  //     }
  //    }
  //    else{
  //     res.status(422).send({'message':'Email is registered'});
  //    }
  //  })
  // }catch(err){
  //   res.status(422).send(err);
  //  }
};

exports.loginCompany = (req, res, next) => {
  Company.findOne({ email: req.body.email })
    .exec()
    .then(company => {
      if (!company.email) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
