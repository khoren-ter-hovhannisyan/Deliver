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
    createIndexes: { unique: true }
  },
  address:{
    type:String,
    createIndexes: { unique: true },
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
