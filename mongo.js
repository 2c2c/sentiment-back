if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.mongo_url);

require("./schema").hourlyTweets(mongoose);

module.exports = mongoose;
