if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var Twit = require("twit");
var sentiment = require("sentiment");
var moment = require("moment");
var ss = require("simple-statistics");

var mongoose = require("./mongo");
var HourlyTweets = mongoose.model("hourlytweets");

function analyzeStats(stats) {
  let median = ss.median(stats.map(s => s.total_sent));
  let mean = ss.mean(stats.map(s => s.total_sent));
  let sd = ss.sampleStandardDeviation(stats.map(s => s.total_sent));
  let low = ss.min(stats.map(s => s.total_sent));
  let high = ss.max(stats.map(s => s.total_sent));

  console.log({ mean, median, sd, low, high });
}

const ONE_MINUTE = 60 * 1000;
var T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  // optional HTTP request timeout to apply to all requests.
  timeout_ms: ONE_MINUTE
});

let stream = T.stream("statuses/sample");

stats = [];

let is_stream_active = false;
let num_tweets = 0;
let sent = [];
let comp = [];
stream.on("tweet", tweet => {
  if (!is_stream_active) {
    return;
  }
  if (tweet.lang !== "en") {
    return;
  }
  if (num_tweets < process.env.sample_size) {
    num_tweets++;
    sent.push(sentiment(tweet.text).score);
    comp.push(sentiment(tweet.text).comparative);
    return;
  }

  // send data and pause stream after getting sample
  let total_sent = ss.sum(sent);
  let mean = ss.mean(sent);
  let median = ss.median(sent);
  let sd = ss.sampleStandardDeviation(sent);
  let low = ss.min(sent);
  let high = ss.max(sent);
  sent = [];
  comp = [];

  let tweet_data = new HourlyTweets({
    num_tweets,
    total_sent,
    low,
    high,
    time: moment().format()
  });

  tweet_data
    .save()
    .then(() => {
      console.log("saved to db");
    })
    .catch(err => {
      console.log(err);
    });

  console.log("ending stream");
  stream.stop();
  num_tweets = 0;
  is_stream_active = false;
});

const ONE_HOUR = 1000 * 60 * 60;
setInterval(
  () => {
    console.log("starting stream back up");
    if (num_tweets > 0) {
      console.warn("num_tweets > 0, were still in the middle of stuff");
      return;
    }

    if (is_stream_active) {
      console.warn("stream is already active");
      return;
    }

    stream.start();
    is_stream_active = true;
  },
  ONE_HOUR
);
