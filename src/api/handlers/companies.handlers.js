const Company = require("../models/company.model");
const Users = require("../models/users.model");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies.map(el=>{
       return {
          name:el.name,
          email:el.email,
          phone:el.phone,
          taxNumber:el.taxNumber?el.taxNumber:"",
          address:el.address
       }
    }))
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
    Users.findOne( {email:req.body.email},async function (err, results) {
         if (err) { res.status(422).send(err)}
         if (!results) {    
          try{
            const newCompany = new Company(req.body) ;
            const company = await newCompany.save();
            res.send(company);
          } catch (err) {
            res.status(404).send(err);
          }
         }
         else{
          res.status(422).send({'message':'Email is registered'});
         }
       })
      }catch(err){
        res.status(422).send(err);
       }
}