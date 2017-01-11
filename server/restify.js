var mongoose = require('./mongo')
var HourlyTweets = require('./schema.js').hourlyTweets(mongoose)
var restify = require('restify');

var server = restify.createServer();

server.listen(process.env.PORT || 3001, function () {
  console.log('%s listening at %s', server.name, server.url);
});

restify.defaultResponseHeaders = false; // disable altogether

server.get('/hourlytweets', (req, res, send) => {
  let query = HourlyTweets.find((err, tweet) => {
    req.log
    res.send(tweet)
  })
})
