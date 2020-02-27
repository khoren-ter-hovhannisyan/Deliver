const { Schema, model } = require("mongoose");

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    require:true
  },
  phone: {
    type: Number,
    required: true
  },
  taxNumber:{
    type:Number,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  activity:{
    type: String, 
    required: true,
  },
  approved:{
    type:Boolean
  }
});



module.exports = model("Company", companySchema);
