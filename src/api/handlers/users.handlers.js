const Company = require("../models/company.model");
const Users = require("../models/users.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.json(users);
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.getUserById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await Users.findOne({ _id });
    res.json(user);
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.createUser = async (req, res) => {
  try {
    const company = Company.findOne({email:req.body.email})
    if(!company.email){
      console.log(company)
      try{
        const newUser = new Users(req.body) ;
        const user = await newUser.save();
        res.send(user);
      } catch (err) {
        res.status(404).send(err);
      }
    }}
  catch(err){
        res.status(422).send(err);
  }    
};
