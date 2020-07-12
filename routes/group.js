var express = require('express');
var router = express.Router();
let controller = require("../controllers/group.controller")
let auth = require("../middleware/auth")
/* GET home page. */
router.get('/', controller.getGroups);
router.post('/', auth, controller.addGroup);
router.get('/profs', auth, controller.groupProfs);
router.get('/assign', controller.assign_groups)
router.get('/:id', auth, controller.getGroup);
module.exports = router;
