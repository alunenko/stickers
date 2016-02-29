var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);

    res.json(user);
  });
});

module.exports = router;
