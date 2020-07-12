var mongoose = require('mongoose');
var database = require('../database');
const Joi = require("joi");
const scheduleSchema = new mongoose.Schema({
  Id: mongoose.Schema.Types.ObjectId,
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
  body: {
    sat_start: Number,
    sat_end: Number,
    sun_start: Number,
    sun_end: Number,
    mon_start: Number,
    mon_end: Number,
    tue_start: Number,
    tue_end: Number,
    wed_start: Number,
    wed_end: Number,
    thr_start: Number,
    thr_end: Number,
    fri_start: Number,
    fri_end: Number,
  }
});

function fromDB(sch) {
  return {
    sat_start: time(sch.sat_start),
    sat_end: time(sch.sat_end),
    sun_start: time(sch.sun_start),
    sun_end: time(sch.sun_end),
    mon_start: time(sch.mon_start),
    mon_end: time(sch.mon_end),
    tue_start: time(sch.tue_start),
    tue_end: time(sch.tue_end),
    wed_start: time(sch.wed_start),
    wed_end: time(sch.wed_end),
    thr_start: time(sch.thr_start),
    thr_end: time(sch.thr_end),
    fri_start: time(sch.fri_start),
    fri_end: time(sch.fri_end),
  }
}

function toDB(data) {
  if (data.length !== 14) return {error: true, status:"Wrong length"};
  return {
    sat_start: timestmp(data[0]),
    sat_end: timestmp(data[1]),
    sun_start: timestmp(data[2]),
    sun_end: timestmp(data[3]),
    mon_start: timestmp(data[4]),
    mon_end: timestmp(data[5]),
    tue_start: timestmp(data[6]),
    tue_end: timestmp(data[7]),
    wed_start: timestmp(data[8]),
    wed_end: timestmp(data[9]),
    thr_start: timestmp(data[10]),
    thr_end: timestmp(data[11]),
    fri_start: timestmp(data[12]),
    fri_end: timestmp(data[13]),
  }
}
function timestmp(str) {
  return Date.parse(`01/01/1970 ${str}`)
}
function time(s) {
  s += 12600000
  return new Date(s).toISOString().slice(-13, -8);
}
const Schedule = mongoose.model('Schedule', scheduleSchema);
exports.Schedule = Schedule;
exports.conformToDB = toDB;
exports.conformToView = fromDB;
