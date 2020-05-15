var express = require('express');
var router = express.Router();
let controller = require("../controllers/proposal.controller")
let auth = require("../middleware/auth")
/* GET home page. */
// router.get('/', controller.addProposal);
router.post('/', auth, controller.addProposal);
// router.get('/profs', auth, controller.groupProfs);
// router.get('/:id', auth, controller.getGroup);

module.exports = router;
