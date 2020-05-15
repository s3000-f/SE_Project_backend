var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let env = process.env.NODE_ENV || 'development';

  res.json({method: req.method, type: typeof req.method, environment: env})
  // res.render('index', { title: 'Express' });
});

module.exports = router;
