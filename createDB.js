var User = require('./models/user').User;

var user = new User({
  username: 'Тестер2',
  password: 'secret'
});

user.save(function(err, user, affected) {
  if (err) throw err;

  console.log(arguments, 'arguments');

  console.log('new field was saved' + user);
});
