const Company = require("../models/company.model");
const Users = require("../models/users.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.json(users.map(({_id,name, lastName,email,phone,address})=>{
      return {
        id:_id,
         name,
         lastName,
         email,
         phone,
         address
      }
   }))
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.getUserById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const {_id, name, lastName, email, phone, address } = await Users.findOne({ _id });
    res.json({
      id:_id,
      name,
      lastName,
      email,
      phone,
      address,
    });
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.createUser = async (req, res) => {

  Company.find({ email: req.body.email })
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
          const user = new Users({
            ...req.body,
            password: hash
          });
          user.save(function(err, user) {
            if(err) {
            return  res.status(500).json(err)}
            res.status(201).json({
              message: "Deliverer created"
            })
          })  
        }
      });
    }
  });
   
}

exports.delUser = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await Users.findByIdAndRemove({ _id });
    res.send(user);
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.updateUser = async (req, res) => {
  const { id: _id } = req.body;
  try {
    const user = await Users.findByIdAndUpdate(
      _id,
      { ...req.body },
      {
        new: true
      }
    );
    res.send(user);
  } catch (err) {
    res.status(404).send(err);
  }
};
