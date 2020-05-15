const mongoose = require('mongoose');
const database = require('../database');
const field = require('./schedule.model');
const Joi = require("joi");
const Schema = mongoose.Schema;
const groupSchema = new Schema({
  Id: Schema.Types.ObjectId,
  manager: {type: Schema.Types.ObjectId, ref: 'User'},
  professors: [{type: Schema.Types.ObjectId, ref: 'User'}],
  name: String
});

const Group = mongoose.model('Group', groupSchema);

function validateGroup (sub) {
  const schema = {
    name: Joi.string().required(),
    manager: Joi.string(),
    professors: Joi.array().items(Joi.string())
  }
  return Joi.validate(sub,schema);
}



exports.Group = Group;
exports.validateGroup = validateGroup;
