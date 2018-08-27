var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mongo');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());

app.get('/podcasts', function (req, res) {
  db.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/settings', (req, res) => {
  db.update(req.body);
  res.status(200).send('done');
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

