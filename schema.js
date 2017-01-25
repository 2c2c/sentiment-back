module.exports = {
  hourlyTweets: function(mongoose) {
    var Schema = mongoose.Schema;
    var hourlyTweetsSchema = new Schema({
      num_tweets: Number,
      total_sent: Number,
      low: Number,
      high: Number,
      time: String
    });

    return mongoose.model("hourlytweets", hourlyTweetsSchema);
  }
};
