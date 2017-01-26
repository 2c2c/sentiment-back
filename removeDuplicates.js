// removes duplicate entries from db to cleanup mess from early on
var mongoose = require("./mongo");
var HourlyTweets = mongoose.model("hourlytweets");
var moment = require("moment");
var async = require("async");
var _ = require("lodash")

const dates = tweets => {
  return tweets
    .map(t => moment(t.time).format("YYYY-MM-DD"))
    .filter((d, i, arr) => arr.indexOf(d) === i);
};

const filteredTweets = (tweets, date) => {
  return tweets.filter(t => moment(t.time).isSame(date, "day"));
};

const buildTimestamp = (date, hour) => {
  const zero_leading_hour = hour < 10 ? String(hour + 100).substring(1) : hour;

  const new_timestamp = `${date}T${zero_leading_hour}:00:00-08:00`;

  return new_timestamp;
};

const extraDatapoints = (docs,hour) => {
  const date_list = dates(docs);
  const extra_datapoints = date_list.map(d => {
    const tweets_by_date = filteredTweets(docs, d);

    console.log(hour)
    const timestamp = buildTimestamp(d, hour);

    const filtered = tweets_by_date.filter(
      t => moment(t.time).isSame(timestamp, "hour")
    );

    //greatest to least
    return filtered.sort((a, b) => {
      if (a.total_sent < b.total_sent) {
        return 1;
      }
      if (a.total_sent > b.total_sent) {
        return -1;
      }

      return 0;
    }).splice(1);
  });

  return extra_datapoints;
};
HourlyTweets.find({}, (err, docs) => {
  if (err) {
    console.log(err);
    return;
  }

  const values = _.range(24)
  const test = values.map(i => extraDatapoints(docs, i+1))

  const items_to_delete = _.flattenDeep(test)
  let i = items_to_delete.length

  while(i--) {
    HourlyTweets.remove(items_to_delete[i], (err, res) => {
      if (err) {
        console.log(err)
      }
      console.log("removed ", res)
    })
  }


  //im gonna kms
  // HourlyTweets.remove(_.flattenDeep(test), () => console.log("ok"))
});
