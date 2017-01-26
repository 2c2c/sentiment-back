// inserts dummy data into mongo
var mongoose = require("../mongo");
var HourlyTweets = mongoose.model("hourlytweets");
var moment = require("moment");
var async = require("async");
var range = require("lodash/range");

// async.eachSeries(
//   range(50),
//   (i, cb) => {
//     const data = require("./dat.json");
//     const time = data.time;
//     let newdata = data.map(d => {
//       d.time = moment(d.time).add(1, "days").format();
//       console.log(d.time);
//       return d;
//     });
//     HourlyTweets.insertMany(data, (err, docs) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       cb();
//     });
//   },
//   err => {
//     if (err) {
//       console.log(err);
//     }
//     console.log("fin");
//   }
// );
const data = require("./dat.json")
  .map(d => {
    return {
      num_tweets: d.num_tweets,
      total_sent: d.total_sent,
      low: d.low,
      high: d.high,
      time: d.time
    };
  })
  .sort((a, b) => {
    return moment.utc(a.time).diff(moment.utc(b.time));
  });

console.log(data)
HourlyTweets.insertMany(data, (err, docs) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(docs);
});
