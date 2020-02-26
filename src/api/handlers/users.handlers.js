const Company = require("../models/company.model");
const Users = require("../models/users.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    res.json(users.map(el=>{
      return {
        id:el._id,
         name:el.name,
         lastName:el.lastName,
         email:el.email,
         phone:el.phone,
         address:el.address
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
  try {
    Company.findOne({email:req.body.email},async function(err,results){
      if (err) { res.status(422).send(err)}
    if(!results){
      try{
        const newUser = new Users(req.body) ;
        const {_id, name, lastName, email, phone, address } = await newUser.save();
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
    }
    else{
      res.status(422).send({'message':'Email is registered'});
     }
  })
}catch(err){
        res.status(422).send(err);
  }    
}
