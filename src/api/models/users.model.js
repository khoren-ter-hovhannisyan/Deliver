const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
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
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  }
});

module.exports = model("User", usersSchema);
