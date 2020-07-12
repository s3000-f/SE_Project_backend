var express = require('express');
var router = express.Router();
let controller = require("../controllers/proposal.controller")
let auth = require("../middleware/auth")
/* GET home page. */
router.get('/', controller.get_proposal);
router.post('/', auth, controller.addProposal);
router.post('/judge', auth, controller.judge_proposal);
router.post('/reset', auth, controller.judge_reset);
router.post('/defense', auth, controller.judge_defense);
router.post('/final', auth, controller.judge_final);
// router.get('/profs', auth, controller.groupProfs);
// router.get('/:id', auth, controller.getGroup);
router.get('/judges', auth, controller.get_judges);
router.post('/judges', auth, controller.set_judges)

module.exports = router;
