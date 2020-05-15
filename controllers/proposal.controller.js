const {User} = require("../models/users.model");
const {Proposal, validateProposal} = require("../models/proposal.model");
const {SubmittedForm, validateAnswers} = require("../models/submitted_exam");
const {Question, validateAllQ} = require("../models/question.model");
const {forEach} = require('p-iteration');


exports.addProposal = async (req,res,next) => {
    let user = await User.findOne({org_id: req.user.org_id});
    if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
    if (user.level !== 1 && user.level !== 4) return  res.status(403).json({status: "شما دسترسی به این قسمت ندارید"});
    if (user.proposals && user.proposals.length !== 0) return  res.status(409).json({status: "شما یک پروپوزال باز دارید"});
    let bod = req.body;
    const {error} = validateProposal(bod);
    if (error)
        return res.status(400).json({status: error.details[0].message})
    let guid = await User.findOne({org_id: req.body.guid_prof});
    if (!quid) return res.status(404).json({status: "استاد مشخص شده یافت نشد"});
    let prop = await new Proposal({
        title: bod.title,
        date_created: Date.now(),
        date_send: -1,
        date_defense: -1,
        date_accepted: -1,
        date_revision: -1,
        date_deadline: -1,
        file: '',
        revised_file: '',
        final_file: '',
        should_revise: false,
        revision_comments: [],
        final_comments: [],
        keywords: bod.keywords,
        summary: bod.summary,
        approved: false,
        guide_prof: guid,
        student: user,
        group: user.group,
        judges: [],
    }).save()
    if (!prop) return res.status(500).json({status: "خطا در ثبت اطلاعات"});
    if (user.level === 1) {
        user.proposals.clear()
        user.proposals.push(prop)
        user.save((err, usr) => {
            if (err) return res.status(500).json({status: "خطا در ثبت اطلاعات"});
            return res.status(200).json({status: "success", result: prop})
        })
    } else {
        user.proposals.push(prop);
        user.save((err, usr) => {
            if (err) return res.status(500).json({status: "خطا در ثبت اطلاعات"});
            usr.populate("proposals", "-_id");
            return res.status(200).json({status: "success", result: usr.proposals})
        })
    }

}