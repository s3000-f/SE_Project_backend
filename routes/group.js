var express = require('express');
var router = express.Router();
let controller = require("../controllers/group.controller")
let auth = require("../middleware/auth")
/* GET home page. */
router.get('/', auth, controller.getGroups);
router.get('/:id', auth, controller.getGroup);
router.get('/profs', auth, controller.groupProfs);

module.exports = router;
