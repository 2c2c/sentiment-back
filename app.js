var mongoose = require('./mongo')
var HourlyTweets = mongoose.model('hourlytweets')
var restify = require('restify')
var sent = require('./sent')

var server = restify.createServer();

server.listen(process.env.PORT || 3001, function () {
  console.log('%s listening at %s', server.name, server.url);
});

restify.defaultResponseHeaders = false; // disable altogether

server.get('/api/hourlytweets', (req, res, send) => {
  let query = HourlyTweets.find((err, tweet) => {
    req.log
    res.send(tweet)
  })
})

const TEN_MINUTES = 1000 * 60 * 10
setInterval(() => {
  console.log('10min ping')
}, TEN_MINUTES)