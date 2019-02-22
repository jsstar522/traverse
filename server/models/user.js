const Joi = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    default: 'aaa@hanmail.net' 
  },
  password: {
    type: String,
    required: true,
    trim: true,
    default: 'aaaa'
  },
  firstName: String,
  lastName: String,
  countryOfResidence: {
    type: String,
    uppercase: true
  },
  onType: {
    type: String,
    enum: ['supplier', 'buyer', 'admin'],
    required: true,
    default: 'buyer'

  }, 
  provider: {
    type: String,
    required: true,
    default: 'local',
  },
  oauth2: String,
  posts_host: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  posts_join: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }]
}, {
  timestamps: true
});
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
    firstName: Joi.string().min(1),
    lastName: Joi.string().min(1),
    countryOfResidence: Joi.string().min(1).uppercase(),
    onType: Joi.string().required(),
    provider: Joi.string().required(),
    oauth2: Joi.string()
  }
  return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.validate = validateUser;
exports.User = User;