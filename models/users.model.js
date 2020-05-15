const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//simple schema
const UserSchema = new Schema({
  Id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 14
  },
  org_id: {
    type: String,
    required: true,
    unique: true,
    minlength: 7,
    maxlength: 10
  },
  email: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  salt: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  level: Number,
  proposals: [{type: Schema.Types.ObjectId, ref: 'Proposal'}],
  edu_type: Boolean,
  group: {type: Schema.Types.ObjectId, ref: 'Group'},
  working_hours: {type: Schema.Types.ObjectID, ref:'Schedule'},
  field_of_expertise: String
});
// edu_type: True -> tahghigh mehvar
// edu_type: False -> amoozesh mehvar
// level 1: student
// level 2: Professor
// level 3: Group Manager
// level 4: Site Admin

//custom method to generate authToken
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id: this._id, level: this.level, org_id: this.org_id}, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
};

const User = mongoose.model('User', UserSchema);

//function to validate user
function validateUser (user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).email(),
    phone: Joi.string().min(10).max(14).required(),
    org_id: Joi.string().min(7).max(10).required(),
    password: Joi.string().min(3).max(255).required(),
    group: Joi.string().min(3).max(255).required(),
    secret: Joi.string().min(0).max(200)
  };

  return Joi.validate(user, schema);
}

function validateLogin (user) {
  const schema = {
    org_id: Joi.string().min(7).max(10).required(),
    password: Joi.string().min(3).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
exports.loginValidate = validateLogin;
