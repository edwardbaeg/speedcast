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
    speed: 1,
    playedSeconds: 0,
  }, {
    id: 1,
    url: 'https://content.production.cdn.art19.com/episodes/be049f33-87a9-402a-aea5-09746ee938a0/cd8da8b9745d68b9e08618ea2d97ed6b043a3f8101c63f9886d1aced3892166f35e9f44690a3a601925ba894929b7c8860b6302d421305d10a6b81f0e27cfda5/PC%20WIZARD%20%2B%20PROPHET%20MIX%20GR%20180822.mp3',
    title: 'Two (Totally Opposite) Ways to Save the Planet',
    channel: 'Freakonomics',
    speed: 1,
    playedSeconds: 0,
  },
];

db.Podcast.insertMany(pods)
  .then(() => console.log('db seeded'))
  .catch(err => console.log('seeding error'));
