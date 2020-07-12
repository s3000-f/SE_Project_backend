const {User} = require("../models/users.model");
const {Proposal, validateProposal} = require("../models/proposal.model");
const {forEach} = require('p-iteration');
const {notification} = require('./notification.controller')

exports.addProposal = async (req, res, next) => {
  let user = await User.findOne({org_id: req.user.org_id}).populate('group');
  if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
  if (user.level !== 1 && user.level !== 4) return res.status(403).json({status: "شما دسترسی به این قسمت ندارید"});
  if (user.proposals && user.proposals.length !== 0) return res.status(409).json({status: "شما یک پروپوزال باز دارید"});
  let bod = req.body;
  const {error} = validateProposal(bod);
  if (error)
    return res.status(400).json({status: error.details[0].message})

  new Proposal({
    title: bod.title,
    status: 1,
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
    revision_comments: ['', ''],
    final_comments: ['', ''],
    keywords: bod.keywords,
    summary: bod.summary,
    approved: false,
    guide_prof: req.body.guide_prof,
    student: user.name,
    group: user.group.name,
    judges: []
  }).save((err, prp) => {
    console.log(err)
    notification(prp.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    notification(prp.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")

    if (err) return res.status(500).json({status: "خطا در ثبت اطلاعات"});
    if (!prp) return res.status(500).json({status: "خطا در ثبت اطلاعات"});
    else res.status(200).json({status: 'success', result: prp})
  })

}
exports.get_proposal = async (req, res, next) => {
  let id = req.query.proposal_id
  let prop = await Proposal.findById(id)
  res.status(200).json({status: 'success', result: prop})
}

exports.get_judges = async (req, res, next) => {
  let pid = req.query.proposal_id
  if (!pid) res.status(400).send('id required')
  else {
    let prop = Proposal.findById(pid)
    res.status(200).json({status: 'success', result: prop.judges})
  }

}
exports.set_judges = async (req, res, next) => {
  let pid = req.body.proposal_id
  let profs = req.body.profs
  if (!pid) return res.status(400).send('id required')
  let prop = await Proposal.findById(pid)
  prop.judges = profs
  prop.status = 2
  prop.save(e => {
    notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    if (e) return res.status(500).json(e)
    else return res.status(200).json({status: 'success', result: prop})
  })
}

exports.judge_proposal = async (req, res, next) => {
  let comment = req.body.comment
  let id = req.body.proposal_id
  let user = await User.findOne({org_id: req.user.org_id});
  if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
  let prop = await Proposal.findById(id)
  if (prop.date_revision !== -1 && prop.date_revision < Date.now()) {
    return res.status(403).json({status: 'failed', result: prop})
  }
  let position = prop.judges[0] === user.name ? 0 : 1
  if (comment) {
    let data = [];
    data.push(position === 0 ? comment : prop.revision_comments[0])
    data.push(position === 1 ? comment : prop.revision_comments[1])
    prop.revision_comments = data
  } else {
    let data = [];
    data.push(position === 0 ? 'تایید' : prop.revision_comments[0])
    data.push(position === 1 ? 'تایید' : prop.revision_comments[1])
    prop.revision_comments = data
  }
  if (prop.revision_comments[0] !== '' && prop.revision_comments[1] !== '') {
    let approved = 0
    for (let i = 0; i < prop.revision_comments.length; i++) {
      if (prop.revision_comments[i] === 'تایید') {
        approved++;
      }
    }
    if (approved === prop.revision_comments.length) {
      prop.status = 4
      let d = getNextDayOfWeek(new Date(), prop.title.length % 2 === 0 ? 1 : 3)
      d.setHours(9, 0)
      console.log(d)
      prop.date_defense = d.getTime()
    } else if (approved === 0) {
      prop.status = 9
      let user = await User.findOne({name: prop.student})
      user.edu_type = false
      await user.save(e => {
        if (e) console.log(e)
      })
    } else {
      prop.status = 3
      if (prop.date_revision === -1) {
        let d = new Date()
        d.setDate(d.getDate() + 10)
        console.log(d)
        prop.date_revision = d.getTime()
      }
    }
    prop.save(e => {
      notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      if (e) res.status(500).json(e)
      else res.status(200).json({status: 'success', result: prop})
    })
  } else {
    prop.save(e => {
      notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      if (e) res.status(500).json(e)
      else res.status(200).json({status: 'success', result: prop})
    })
  }
}

exports.judge_reset = async (req, res, next) => {
  let id = req.query.proposal_id
  // console.log()
  let prop = await Proposal.findById(id)
  console.log(prop.date_revision)
  if (prop.date_revision !== -1 && prop.date_revision < Date.now()) {
    prop.status = 9

    let user = await User.findOne({name: prop.student})
    user.edu_type = false
    await user.save(e => {
      if (e) console.log(e)
    })
    prop.save(e => {
      notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      if (e) res.status(500).json(e)
      else res.status(403).json({status: 'failed', result: prop})
    })
  } else {
    prop.revision_comments = ['', '']
    prop.status = 2
    prop.save(e => {
      notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
      if (e) res.status(500).json(e)
      else res.status(200).json({status: 'success', result: prop})
    })
  }

}

exports.judge_defense = async (req, res, next) => {
  let id = req.body.proposal_id
  let pass = req.body.accepted
  let prop = await Proposal.findById(id)
  if (pass) {
    prop.status = 6
  } else {
    prop.status = 5
    let user = await User.findOne({name: prop.student})
    user.edu_type = false
    await user.save(e => {
      if (e) console.log(e)
    })
  }
  prop.save(e => {
    notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    if (e) res.status(500).json(e)
    else res.status(200).json({status: 'success', result: prop})
  })
}

exports.judge_final = async (req, res, next) => {
  let id = req.body.proposal_id
  let pass = req.body.comment
  let prop = await Proposal.findById(id)
  if (pass) {
    prop.final_comments = [pass]
    prop.status = 7
    let user = await User.findOne({name: prop.student})
    user.edu_type = false
    await user.save(e => {
      if (e) console.log(e)
    })
  } else {
    prop.final_comments = ['تایید']
    prop.status = 8
  }
  prop.save(e => {
    notification(prop.student, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    notification(prop.guide_prof, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
    if (e) res.status(500).json(e)
    else res.status(200).json({status: 'success', result: prop})
  })
}

function getNextDayOfWeek (date, dayOfWeek) {
  // Code to check that date and dayOfWeek are valid left as an exercise ;)

  var resultDate = new Date(date.getTime());

  resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

  return resultDate;
}
