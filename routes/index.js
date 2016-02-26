var express = require('express');
var router = express.Router();
var http = require('http');
var Sticker = require('../models/sticker').Sticker;

module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  io.on('newNote', function(socket) {
    console.log('module exports newNote');
  });

  /* GET home page. */
  router.get('/test', function(req, res, next) {
    var date = new Date(+req.query.date);

    var totalPostCount = {};
    var zzz = Sticker.find(
      {
        "date": {
          "$gte": new Date(date.getFullYear(), date.getMonth(), 1),
          "$lt":  new Date(date.getFullYear(), date.getMonth() + 1, 0)
        }
      }
      , function(err, resPostsInMonth) {
        if(err) throw err;
      }
    ).exec();

    zzz.then(function(resPostsInMonth) {

      for (var i = 0; i < resPostsInMonth.length; i++) {
        if(totalPostCount[+resPostsInMonth[i].date.getDate()] == undefined) {
          totalPostCount[+resPostsInMonth[i].date.getDate()] = 1;
          continue;
        }

        totalPostCount[+resPostsInMonth[i].date.getDate()] = totalPostCount[+resPostsInMonth[i].date.getDate()]+1;
      }

      console.log(totalPostCount, 'totalPostCount');

      Sticker.find(
        {
          "date": {
            "$gte": new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            "$lt":  new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          }
        }
        , function(err, notes) {

          var obj = {
            notes: notes,
            totalPostCount: totalPostCount
          };

          res.json(obj);
        }
      );
    });
  });





  router.get('/', function(req, res, next) {
    if(req.query.date == undefined) req.query.date = new Date();

    var date = new Date(+req.query.date);

    var totalPostCount = {};
    var zzz = Sticker.find(
      {
        "date": {
          "$gte": new Date(date.getFullYear(), date.getMonth(), 1),
          "$lt":  new Date(date.getFullYear(), date.getMonth() + 1, 0)
        }
      }
      , function(err, resPostsInMonth) {
        if(err) throw err;
      }
    ).exec();

    zzz.then(function(resPostsInMonth) {

      for (var i = 0; i < resPostsInMonth.length; i++) {
        if(totalPostCount[+resPostsInMonth[i].date.getDate()] == undefined) {
          totalPostCount[+resPostsInMonth[i].date.getDate()] = 1;
          continue;
        }

        totalPostCount[+resPostsInMonth[i].date.getDate()] = totalPostCount[+resPostsInMonth[i].date.getDate()]+1;
      }

      console.log(totalPostCount, 'totalPostCount');

      Sticker.find(
        {
          "date": {
            "$gte": new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            "$lt":  new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          }
        }
        , function(err, notes) {

          res.render('index', {
            title: 'Home page',
            user: 'Guest',
            footer: 'footer',
            dates: notes,
            ttt: JSON.stringify(totalPostCount)
          });
        }
      );
    });
  });

  router.post('/', function(req, res, next) {
    var sticker = new Sticker({
      date: req.body.date,
      subject: req.body.subject,
      message: req.body.message
    });

    sticker.save(function(err, sticker, affected) {
      if (err) throw err;
    });

    res.render('index', {
      title: 'Home page',
      user: 'Guest',
      footer: 'footer',
      dates: sticker
    });
  });

  return router;
};
