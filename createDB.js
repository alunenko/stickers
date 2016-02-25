var Sticker = require('./models/sticker').Sticker;

var sticker = new Sticker({
  date: 1456221480917,
  subject: 's1',
  message: 'm1'
});

sticker.save(function(err, sticker, affected) {
  if (err) throw err;

  console.log('new field was saved' + sticker);
/*  Sticker.find({ date: '1456221480917' }, function(err, sticker) {
    console.log(sticker);
  });*/
});
