var express = require('express');
const {forEach} = require('p-iteration');
const {User} = require("../models/users.model");
const {Group, validateGroup} = require("../models/group.model");
exports.getGroups = async (req, res) => {
    let groups = await Group.find().populate("manager", "name").select("_id name manager")
    if (!groups) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
    return res.status(200).json({status: "success", result: groups})
}

exports.getGroup = async (req, res) => {
    let {id} = req.params;
    if (req.user.level > 2) {
        let group = await Group.findById(id).populate("manager").populate("professors", "name")
        return res.status(200).json({status: "success", result: group})
    } else {
        return res.status(403).json({status: "شما اجازه دسترسی به این بخش را ندارید"});
    }
}

exports.groupProfs = async (req, res, next) => {
    let user = await User.findOne({org_id: req.user.org_id}).populate("group").select("group");
    if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
    console.log(user)
    if (!user.group || user.group.length === 0) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
    let group = await Group.findById(user.group[0]).populate("professors", "name org_id").select("professors");
    return res.status(200).json({status: "success", result: group})
}

exports.addGroup = async (req, res, next) => {
    let user = await User.findById(req.user._id)
    console.log(user.level)
    if (!user) return res.status(500).json({status: "خطا در دریافت اطلاعات"});
    if (user.level !== 4) return res.status(403).json({status: "شما اجازه دسترسی به این بخش را ندارید"});
    const {error} = validateGroup(req.body);
    if (error) return res.status(400).json({status: error.details[0].message});
    let group = new Group({
        name: req.body.name,
        manager: req.body.manager ? req.body.manager : null,
        professors: req.body.professors ? req.body.professors : []
    }).save((err,grp) => {
        console.log(err)
        console.log(grp)
        if (err) return res.status(500).json({status: "خطا در ثبت اطلاعات"});
        return res.status(200).json({status:"success", result: grp})
    })

}
