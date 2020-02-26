const { Schema, model } = require("mongoose");

const companySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
    required:true,},
  password: {
    type: String,
    required: true
  },
  activity:{
    type: String, 
    required: true,
  },
});



module.exports = model("Company", companySchema);
