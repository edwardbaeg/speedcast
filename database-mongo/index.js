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
  id: Number,
  url: String,
  title: String,
  channel: String,
  speed: Number,
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

const update = (data, callback) => {
  const { currentItem, speed } = data;
  Podcast.update({ id: currentItem }, { speed: speed }, (response) => console.log(response));
};

module.exports = {
  selectAll,
  update,
  Podcast,
};
