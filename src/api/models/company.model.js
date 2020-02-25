const { Schema, model } = require("mongoose");

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
   // validate: [isEmail, "invalid email"],
    unique: true
  },
  address: {
    type: String
  },
  phone: {
    type: Number,
    required: true
  },
  taxNumber:{
    type:Number,
    max:20 
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = model("Company", companySchema);
