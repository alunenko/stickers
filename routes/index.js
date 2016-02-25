var express = require('express');
var router = express.Router();
var Sticker = require('../models/sticker').Sticker;

/* GET home page. */
router.get('/test', function(req, res, next) {
  if (req.query.date) {
    req.query.date = new Date(req.query.date);
  }

  var query = Sticker.find();
  query.where('date', req.query.date).exec(function(err, docs){
    res.json(docs);
  });
});

router.get('/', function(req, res, next) {
  if (req.query.date) {
    req.query.date = new Date(req.query.date);
  }

  var query = Sticker.find();
  query.where('date', req.query.date).exec(function(err, docs){
    res.render('index', {
     title: 'Home page',
     user: 'Guest',
     footer: 'footer',
     dates: docs
     });
  });

});

router.post('/', function(req, res, next) {
  console.log(req.body, 5555555);

  var sticker = new Sticker({
    date: req.body.data,
    subject: req.body.subject,
    message: req.body.message
  });

  sticker.save(function(err, sticker, affected) {
    if (err) throw err;

    console.log('new field was saved' + sticker, 2);
  });

  res.render('index', {
    title: 'Home page',
    user: 'Guest',
    footer: 'footer'
  });
});

module.exports = router;
