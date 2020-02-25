const User = require('../models/users.model')

exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (err) {
    res.status(404).send(err);
  }
}
exports.getUserById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await User.findOne({ _id });
    res.json(user);
  } catch (err) {
    res.status(404).send(err);
  }
}

