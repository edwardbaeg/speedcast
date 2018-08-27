const db = require('./index.js');

const clearData = () => {
  db.Podcast.remove({}, err => {
    if (err) {
      console.log('db error', err);
    } else {
      console.log('database cleared');
    }
  });
};

const pods = [
  {
    id: 0,
    url: 'https://content.production.cdn.art19.com/episodes/e379802b-e812-4148-bafc-ef338379d0f7/1eff18a0c2eb8828ce9865b63fa6edfda6381b4c0cff924745e7c0c622e7046cd7c5ea23fc980e54f93cd0680ef67bdcae761acd4cb7c39dc2285ffd38d4db70/PC%20HAPPINESS%20MIX%20GR%20180815%20R1.mp3',
    title: 'How To Be Happy',
    channel: 'Freakonomics',
  }, {
    id: 1,
    url: 'asdf',
    title: 'test',
    channel: 'test channel',
  },
];

db.Podcast.insertMany(pods)
  .then(() => console.log('db seeded'))
  .catch(err => console.log('seeding error'));
