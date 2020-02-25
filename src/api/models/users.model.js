const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email:{
    type: String,
    required: true,
    validate: [isEmail, 'invalid email'],
    createIndexes: { unique: true },
  },
  password: { 
    type: String,
    required: true
  },
  phoneNumber:{
    type:Number,
    required:true
  },

});

module.exports = model('User', usersSchema);
