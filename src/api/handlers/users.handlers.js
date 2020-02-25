const Company = require("../models/company.model");
const Users = require("../models/company.model");

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
exports.postUser = async (req, res) => {
  const newUser = req.body;
  try {
    const company = await Company.findOne({ email: `${newUser.email}` });
    if (!company) {
      try {
        const user = await Users.create(newUser);
        res.json(user);
      } catch {
        res.status(422).send(err);
      }
    }
  } catch (err) {
    res.status(404).send(err);
  }
};
