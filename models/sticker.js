var mongoose = require('../libs/mongoose')
  , Schema = mongoose.Schema;

var schema = new Schema({
  date: {
    type: Date,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

exports.Sticker = mongoose.model('Sticker', schema);
