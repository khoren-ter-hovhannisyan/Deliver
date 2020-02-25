const Company = require("../models/company.model");
const Users = require("../models/users.model");


exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.getCompanyById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const company = await Company.findOne({ _id });
    res.json(company);
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.postCompany = async (req, res) => {
  const newCompany = req.body;
  try {
    const user = await Users.findOne({ email: `${newCompany.email}` });
    if (!user) {
      try {
        const company = await Company.save(newCompany);
        res.json(company);
      } catch {
        res.status(422).send(err);
      }
    }
  } catch (err) {
    res.status(404).send(err);
  }
};
