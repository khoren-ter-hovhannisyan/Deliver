const Company = require("../models/company.model");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.json(
      users.map(el => {
        return {
          id: el._id,
          name: el.name,
          lastName: el.lastName,
          email: el.email,
          phone: el.phone,
          address: el.address
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
  Company.find({ email: req.body.email })
    .then(company => {
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
              password: hash
            });
            console.log(user);
            user.save(function(err, user) {
              if (err) {
                return res.status(500).json(err);
              }
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
  console.log(req.body)
  Users.find({ email: req.body.email })
    .then(user => {
      if (user.length<1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
          if(err){
            return res.status(401).json({
              message:"Auth failed"
            });
          }
          if(result){
            const token = jwt.sign({
              email:user[0].email,
              userId:user[0]._id
            },process.env.JWT_KEY,{
              expiresIn:"12h"
            })
              return res.status(200).json({
                data:{
                  id:user._id,
                  name:user.name,
                  lastName:user.lastName,
                  address:user.address,
                  phone:user.phone
                },
                token:token,
                message:"Auth successful"
              })
          }
          res.status(401).json({
            message:"Auth failed"
          });
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
 };
