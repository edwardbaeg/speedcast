var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/podcasts');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var podcastSchema = mongoose.Schema({
  url: String,
  title: String,
  channel: String,
});

var Podcast = mongoose.model('Item', podcastSchema);

var selectAll = function(callback) {
  Podcast.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports = {
  selectAll,
  Podcast,
};
