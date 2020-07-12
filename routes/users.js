var express = require('express');
var router = express.Router();
const controller = require('../controllers/users.controller');
const auth = require('../middleware/auth');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.post('/login', controller.login);
router.get('/profile', auth, controller.profile);
router.post('/logout', controller.logout);
router.post('/signup', controller.signUp);
router.post('/proposals', auth, controller.addProposal);
router.get('/proposals', auth, controller.getProposals);
router.get('/profs', auth, controller.getProfs);
router.post('/freetimes', auth, controller.set_free_times)
router.get('/freetimes', auth, controller.get_free_times)
router.get('/fire', auth, controller.send_notif)
router.post('/token', auth, controller.set_fire_token)
module.exports = router;
