var Sticker = require('../models/sticker').Sticker;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  Sticker.find({}, function(err, sticker) {
    if (err) throw err;

    console.log('getting all date fields');

    /*res.json(sticker);*/

    res.render('index', {
      title: 'Home page',
      user: 'Guest',
      footer: 'footer',
      dates: sticker
    });
  });

/*  res.render('index', {
    title: 'Home page',
    user: 'Guest',
    footer: 'footer'
  });*/
});

module.exports = router;
