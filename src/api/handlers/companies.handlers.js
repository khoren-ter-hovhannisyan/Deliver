const Company = require("../models/company.model")

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


