const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;

const proposalSchema = new Schema({
  Id: Schema.Types.ObjectId,
  title: String,
  status: Number,
  date_created: Number,
  date_send: Number,
  date_defense: Number,
  date_accepted: Number,
  date_revision: Number,
  date_deadline: Number,
  file: String,
  revised_file: String,
  final_file: String,
  should_revise: Boolean,
  revision_comments: [String],
  final_comments: [String],
  keywords: [String],
  summary: String,
  approved: Boolean,
  guide_prof: String,
  student: String,
  group: String,
  judges: [String],
});

function validateProposal (exam) {
  const schema = {
    title: Joi.string().min(3).max(2500).required(),
    keywords: Joi.array().items(Joi.string().min(3).max(50)),
    guide_prof: Joi.string().required(),
    summary: Joi.string().min(3).max(5000),
    status: Joi.number()
  };

  return Joi.validate(exam, schema);
}


const Proposal = mongoose.model('Proposal', proposalSchema);
exports.Proposal = Proposal;
exports.validateProposal = validateProposal;
