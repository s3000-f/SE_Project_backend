var mongoose = require('mongoose');
const Joi = require("joi");
const facultySchema = new mongoose.Schema({
  Id: mongoose.Schema.Types.ObjectId,
  professors: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
  proposals: [{type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true}],
});

const Faculty = mongoose.model('Faculty', facultySchema);
exports.Faculty = Faculty;

