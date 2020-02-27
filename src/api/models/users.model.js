const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
  type:{
    type:String,
    default: 'user'
  },
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  approved:{
    type:Boolean
  },
  passportURL:{
    type:String,
    required:true
  }
});

module.exports = model("User", usersSchema);
