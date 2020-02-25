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
exports.createtUser = async (req, res) => {
  try {
    const newUser = new Users(req.body) ;

    const user = await newUser.save();
    res.json(user);
  }catch (err) {
    res.status(404).send(err);
}
};
