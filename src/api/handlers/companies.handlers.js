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
exports.createCompany = async (req, res) => {
  try {
    const user = Users.findOne({email:req.body.email})
    if(!user.email){
      try{
        const newCompany = new Company(req.body) ;
        const company = await newCompany.save();
        res.send(company);
      } catch (err) {
        res.status(404).send(err);
      }
    }}
  catch(err){
        res.status(422).send(err);
  }    
};
