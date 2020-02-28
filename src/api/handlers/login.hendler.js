const Company = require("../models/company.model");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




exports.login = (req, res,) => {
    Users.findOne({email:req.bod.email})
    .then(user=>{
        if(!user){
            return null
        };
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
    .then(response=>{
        if(!response){
            Company.findOne({ email: req.body.email })
            .then(company => {
            console.log(company, "555", req.body);
            console.log("**********************************************");
            
            if (!company) {
                return req.body;
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

        }
        return response
    })









//   Users.findOne({ email: req.body.email })
//     .then(user => {
//         console.log(user,"555");
        
//       if (!user) {
//         return res.status(401).json({
//           message: "Auth failed: email or paswword is incorrect"
//         });
//       }
//       bcrypt.compare(req.body.password, user.password, (err, result) => {
//         if (err) {
//           return res.status(401).json({
//             message: "Auth failed: email or password is incorrect"
//           });
//         }
//         if (result) {
//           const token = jwt.sign(
//             {
//               email: user.email,
//               userId: user._id
//             },
//             process.env.JWT_KEY,
//             {
//               expiresIn: "12h"
//             }
//           );
//           return res.status(200).json({
//             data: {
//               id: user._id,
//               name: user.name,
//               lastName: user.lastName,
//               address: user.address,
//               phone: user.phone,
//               type: user.type
//             },
//             token: token,
//             message: "Auth successful"
//           });
//         }
//         res.status(401).json({
//           message: "Auth failed: email or password is incorrect"
//         });
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
};

exports.loginCompany = (req, res) => {
  console.log(req.body);
  Company.findOne({ email: req.body.email })
    .then(company => {
      console.log(company, "555", req.body);
      console.log("**********************************************");
      
      if (!company) {
        return req.body;
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
