var express = require('express');
const bcrypt = require("bcryptjs");
const {forEach} = require('p-iteration');
const {Proposal} = require('../models/proposal.model')
const {notification} = require('./notification.controller')
const {Schedule, conformToDB, conformToView} = require('../models/schedule.model')

const {User, validate, loginValidate} = require("../models/users.model");

exports.login = async (req, res) => {
  // validate the request body first
  const {error} = loginValidate(req.body);
  if (error) return res.status(400).json({status: error.details[0].message});

  //find an existing user
  let user = await User.findOne({org_id: req.body.org_id});
  if (!user) return res.status(401).json({status: "کاربر یافت نشد"});
  let pass = await bcrypt.hash(req.body.password, user.salt);
  if (user.password === pass) {
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).json({
      status: "success",
      user: {
        org_id: user.org_id,
        access_token: token
      }
    });
  } else {
    return res.status(401).json({status: "رمزعبور اشتباه است"});
  }


}
exports.profile = async function (req, res, next) {
  if (req.user.level === 1) {
    const user = await User.findById(req.user._id).select("name org_id phone email level edu_type");
    res.status(200).json({status: "success", result: user});
  } else if (req.user.level === 2 || req.user.level === 3) {
    const user = await User.findById(req.user._id).populate("group", "name").select("-proposals -working_hours -salt -__v -password -group -_id -edu_type");
    res.status(200).json({status: "success", result: user});
  } else if (req.user.level === 4) {
    const user = await User.findById(req.user._id);
    res.status(200).json({status: "success", result: user});
  }

}
exports.logout = function (req, res, next) {
  res.send('logout successful');
};

exports.signUp = async (req, res) => {
  // validate the request body first
  console.log("signup");
  const {error} = validate(req.body);
  if (error) return res.status(400).json({status: error.details[0].message});

  //find an existing user
  let user = await User.findOne({org_id: req.body.org_id});
  if (user) return res.status(400).json({status: "کاربر قبلا ثبت شده است"});
  let pass = req.body.secret;
  let em = req.body.email.toLowerCase();

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: em,
    org_id: req.body.org_id,
    phone: req.body.phone.slice(-10),
    group: req.body.group
  });
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.salt = salt;
  if (pass !== undefined && pass !== null && pass !== '') {
    try {
      user.field_of_expertise = req.body.field;
    } catch (e) {
      console.warn(e)
    }
    if (pass === "UXiI$$=D-b#qI.c}8Na/fW1K~I>GlpX;") {
      user.level = 3
    } else if (pass === "z?_5BxB_4O&XHv8D") {
      user.level = 2
    } else {
      user.level = 1
      user.field_of_expertise = '';
      user.edu_type = true

    }
  } else {
    user.level = 1
    user.edu_type = true
  }
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    status: "success",
    user: {
      org_id: user.org_id,
      name: user.name,
      email: user.email,
      access_token: token
    }
  });
}

exports.getProposals = async (req, res, next) => {
  let type = parseInt(req.query.type)
  console.log(type)
  let user = await User.findOne({org_id: req.user.org_id}).populate('group')
  if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
  if (type === 1) {
    let prop = await Proposal.find({student: user.name})
    console.log(prop)
    return res.status(200).json({status: "success", result: prop})
  } else if (type === 2) {
    let prop = await Proposal.find({guide_prof: user.name})
    return res.status(200).json({status: "success", result: prop})
  } else if (type === 3) {
    let prop = await Proposal.find({judges: user.name})
    return res.status(200).json({status: "success", result: prop})
  } else if (type === 4) {
    let prop = await Proposal.find({group: user.group.name})
    return res.status(200).json({status: "success", result: prop})
  } else {
    let prop = await Proposal.find({status: 6})
    return res.status(200).json({status: "success", result: prop})
  }
}

exports.getGroup = async (req, res, next) => {
  if (req.user.level > 2) {
    let user = await User.findOne({org_id: req.user.org_id}).populate("group", "-_id").select("group");
    if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
    return res.status(200).json({status: "success", result: user.group})
  } else {
    return res.status(403).json({status: "شما اجازه دسترسی به این بخش را ندارید"});
  }
}

exports.addProposal = async (req, res, next) => {
  let user = await User.findOne({org_id: req.user.org_id});
  if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});

}

exports.getProfs = async (req, res, next) => {
  User.find({level: {$gt: 1}}).select('name').then(users => {
    let u = users.map(item => item.name)
    res.status(200).json({status: 'success', result: u})
  }, err => {
    console.log(err)
    res.status(500).send('db error')
  })
}

exports.set_free_times = async (req, res, next) => {
  let body = conformToDB(req.body)
  if (body.error) return res.status(400).json({status: error})
  let schedule = await Schedule.findOne({user: req.user._id})
  if (schedule) {
    schedule.body = body
  } else {
    schedule = new Schedule({
      user: req.user._id,
      body: body
    })
  }
  console.log(schedule.body)
  schedule.save(e => {
    if (e) res.status(500).json(e)
    else res.status(200).json({status: 'success', result: conformToView(schedule.body)})
  })
}

exports.get_free_times = async (req, res, next) => {
  let schedule = await Schedule.findOne({user: req.user._id})
  res.status(schedule ? 200 : 404).json({
    status: schedule ? 'success' : 'not found',
    result: schedule ? conformToView(schedule.body) : {}
  })
}

exports.set_fire_token = async (req, res, next) => {
  let user = await User.findById(req.user._id)
  user.firebase_token = req.body.token
  user.save(e => {
    if (e) res.status(500).json(e)
    else res.status(200).json({status: 'success'})
  })
}

exports.send_notif = async (req,res,next) => {
  let text = req.query.text
  let id = req.query.org
  let user = await User.findOne({org_id: id})
  let st = await notification(user.firebase_token, "وضعیت پروپوزاش شما تغییر یافته است", "تغییر وضعیت پروپوزال")
  res.status(200).send(st)
}

