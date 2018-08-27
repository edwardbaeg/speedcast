const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/podcasts');

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const podcastSchema = mongoose.Schema({
  url: String,
  title: String,
  channel: String,
});

const Podcast = mongoose.model('Item', podcastSchema);

const selectAll = (callback) => {
  Podcast.find({}, (err, items) => {
    if (err) {
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
