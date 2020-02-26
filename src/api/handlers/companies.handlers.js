const Company = require("../models/company.model");
const Users = require("../models/users.model");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies.map(el=>{
       return {
         id:el._id,
          name:el.name,
          email:el.email,
          phone:el.phone,
          taxNumber:el.taxNumber?el.taxNumber:"",
          address:el.address,
          activity:el.activity
       }
    }));
  } catch (err) {
    res.status(404).send(err);
  }
};
exports.getCompanyById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const {_id, name, email, phone, taxNumber, address, activity} = await Company.findOne({ _id });
    res.json({
        id:_id,
         name,
         email,
         phone,
         taxNumber,
         address,
         activity
      });
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
            const {_id, name, email, phone, taxNumber, address, activity} = await newCompany.save();
            res.json({
              id:_id,
               name,
               email,
               phone,
               taxNumber,
               address,
               activity
            });
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