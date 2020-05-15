const {User} = require("../models/users.model");
const {Proposal, validateProposal} = require("../models/proposal.model");
const {SubmittedForm, validateAnswers} = require("../models/submitted_exam");
const {Question, validateAllQ} = require("../models/question.model");
const {forEach} = require('p-iteration');


exports.addProposal = async (req,res,next) => {

}