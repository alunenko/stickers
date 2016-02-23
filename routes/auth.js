var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth', {
    title: 'Auth',
    pageHeader: 'auth header',
    plainText: 'this is auth page',
    pageFooter: 'auth footer'
  });
});

module.exports = router;
