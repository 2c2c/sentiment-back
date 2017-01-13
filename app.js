var mongoose = require('./mongo')
var HourlyTweets = mongoose.model('hourlytweets')
var restify = require('restify')
var sent = require('./sent')

var server = restify.createServer();

server.listen(process.env.PORT || 3001, function () {
  console.log('%s listening at %s', server.name, server.url);
});

restify.defaultResponseHeaders = false; // disable altogether

server.get('/', (req, res, send) => {
  res.send('pong')
})

server.get('/api/hourlytweets', (req, res, send) => {
  let query = HourlyTweets.find((err, tweet) => {
    req.log
    res.send(tweet)
  })
})